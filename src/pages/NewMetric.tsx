import React, { useState, useEffect } from 'react';
import { Select, Card, Button, Input, Row, Col, Tooltip, message, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useModel } from '@umijs/max';

const { Option } = Select;
const { TextArea } = Input;

const exampleFormula = {
  "aggregations": [
    {
      "name": "total_fees",
      "column": "fee",
      "function": "sum"
    }
  ],
  "final_answer": "total_fees"
};

const NewMetric = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { initialState } = useModel('@@initialState');
  const [blockchain, setBlockchain] = useState('');
  const [subChain, setSubChain] = useState('default');
  const [metricName, setMetricName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Default Category');
  const [type, setType] = useState('Default Type');
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [keyValueData, setKeyValueData] = useState([]);

  // Extract blockchains and subchains from initialState
  const blockchains = Object.keys(initialState?.blockchainData || {});
  const subChains = blockchain ? Object.keys(initialState?.blockchainData[blockchain] || {}) : [];
  
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  
  useEffect(() => {
    if (blockchain && subChain) {
      const fetchUrl = `http://localhost:5000/app/metrics/general_features`;
      axios.get(fetchUrl)
        .then(response => {
          console.log('Fetched key-value pairs:', response.data.data);
          setKeyValueData(response.data.data); // Assuming the response is the direct array of key-value pairs
        })
        .catch(error => {
          console.error('Failed to fetch key-value pairs:', error);
          message.error('Failed to fetch key-value pairs.');
          setKeyValueData([]); // Reset on error or handle accordingly
        });
      // const mockData = [
      //   {"key": "key", "value": "value"},
      //   {"key": "key", "value": "value"},
      //   {"key": "key", "value": "value"},
      //   {"key": "key", "value": "value"},
      // ];
      // setKeyValueData(mockData);
    }
  }, [blockchain, subChain]); // Effect dependencies

  const handleJsonInputChange = (e) => {
    const inputValue = e.target.value;
    setJsonInput(inputValue);

    try {
      JSON.parse(inputValue);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handleSubmit = async () => {
    if (!metricName || !blockchain || !isValidJson) {
      message.error('Please fill in all required fields and provide valid JSON input.');
      return;
    }

    const parsedJson = JSON.parse(jsonInput);

    const payload = {
      metric_name: metricName,
      blockchain,
      sub_chain: subChain,
      display_name: displayName,
      description,
      category,
      type,
      formula: parsedJson,
    };

    try {
      await axios.post('http://localhost:5000/app/metrics/add_metric/', payload);
      message.success('Metric submitted successfully!');
    } catch (error) {
      console.error('Error submitting metric:', error);
      message.error('Failed to submit metric.');
    }
  };
  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          {/* Left side content */}
          <Select
            placeholder="Select Blockchain"
            value={blockchain}
            onChange={setBlockchain}
            style={{ width: '100%', marginBottom: 16 }}
          >
            {blockchains.map((bc) => (
              <Option key={bc} value={bc}>
                {bc}
              </Option>
            ))}
          </Select>
  
          {blockchain && (
            <Select
              placeholder="Select Sub Chain"
              value={subChain}
              onChange={setSubChain}
              style={{ width: '100%', marginBottom: 16 }}
            >
              {subChains.map((sc) => (
                <Option key={sc} value={sc}>
                  {sc}
                </Option>
              ))}
            </Select>
          )}
          <Input
            placeholder="Metric Name"
            value={metricName}
            onChange={(e) => setMetricName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input.TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          {/* <Input
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ marginBottom: 16 }}
          /> */}
          
          <Select
            placeholder="Type"
            value={type} // Make sure this is set to `type`, not `blockchain`
            onChange={(value) => setType(value)} // Directly use the value provided
            style={{ width: '100%', marginBottom: 16 }}
          >
            <Option key="Format 1" value="Format 1">Format 1</Option>
            <Option key="Format 2" value="Format 1">Format 2</Option>
          </Select>

        </Col>
  
        <Col span={12}>
          {/* Right side content */}
          <Card style={{ marginBottom: 16 }}>
            <Row gutter={[16, 16]}>
              {keyValueData.map((item, index) => (
                <Col key={index} span={12}>
                  <strong>{item.field_name}:</strong> {item.data_type}
                  <br />
                  {item.description && <strong>{item.description}:</strong>}
                </Col>
              ))}
            </Row>
          </Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <TextArea
              placeholder="Enter formula in JSON format"
              value={jsonInput}
              onChange={handleJsonInputChange}
              style={{ marginBottom: 0, flex: 1 }}
              rows={4}
              status={isValidJson ? undefined : 'error'}
            />
            <Tooltip title="Click to view example formula">
          <InfoCircleOutlined style={{ marginLeft: 8 }} onClick={toggleModal} />
        </Tooltip>
          </div>
  
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: 16 }}>
            Submit
          </Button>
          <Modal
  title="Example Formula"
  visible={isModalVisible}
  onCancel={toggleModal}
  footer={null}
>
  <pre>{JSON.stringify(exampleFormula, null, 2)}</pre>
</Modal>
        </Col>
      </Row>
    </Card>
  );
};

export default NewMetric;

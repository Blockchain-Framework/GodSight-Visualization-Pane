import React, { useState } from 'react';
import { Select, Card, Row, Col, Typography } from 'antd';

const { Option } = Select;
const { Title, Text } = Typography;

const MetricInfo = () => {
  const [blockchain, setBlockchain] = useState(null);
  const [subChain, setSubChain] = useState(null);
  const [metric, setMetric] = useState(null);
  const [keyValueData, setKeyValueData] = useState([]);
  const [metricDetails, setMetricDetails] = useState('');

  // This data would typically come from an API or other data source
  const blockchains = {
    'Blockchain 1': ['Subchain 1-1', 'Subchain 1-2'],
    'Blockchain 2': ['Subchain 2-1', 'Subchain 2-2'],
    // ... more blockchains
  };

  const metrics = {
    'Subchain 1-1': ['Metric 1', 'Metric 2'],
    'Subchain 2-1': ['Metric 3', 'Metric 4'],
    // ... more metrics
  };

  const handleBlockchainChange = (value) => {
    setBlockchain(value);
    setSubChain(null);
    setKeyValueData([]); // Clear previous data
  };

  const handleSubChainChange = (value) => {
    setSubChain(value);
    setMetric(null);
    // Fetch the key-value data and metric details
    setKeyValueData([
      { key: 'Hashrate', value: '123.4 PH/s' },
      { key: 'Difficulty', value: '15.8 T' },
      // ... more key-value pairs
    ]);
  };

  const handleMetricChange = (value) => {
    setMetric(value);
    // Fetch the metric details
    setMetricDetails('This is the detailed information about the selected metric.');
  };

  return (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Select placeholder="Select Blockchain" value={blockchain} onChange={handleBlockchainChange} style={{ width: '100%' }}>
            {Object.keys(blockchains).map((bc) => (
              <Option key={bc} value={bc}>{bc}</Option>
            ))}
          </Select>
        </Col>
        <Col span={12}>
          <Select placeholder="Select Subchain" value={subChain} onChange={handleSubChainChange} style={{ width: '100%' }} disabled={!blockchain}>
            {(blockchains[blockchain] || []).map((sc) => (
              <Option key={sc} value={sc}>{sc}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        {keyValueData.map((item, index) => (
          <Row key={index} gutter={16}>
            <Col span={12}>
              <Text strong>{item.key}:</Text> {item.value}
            </Col>
            {index % 2 !== 0 && <Col span={12} />} {/* Ensuring even distribution */}
          </Row>
        ))}
      </Card>

      <Select placeholder="Select Metric" value={metric} onChange={handleMetricChange} style={{ width: '100%', marginTop: 16 }} disabled={!subChain}>
        {(metrics[subChain] || []).map((m) => (
          <Option key={m} value={m}>{m}</Option>
        ))}
      </Select>

      <Card style={{ marginTop: 16 }}>
        <Title level={5}>Details of Metric</Title>
        <Text>{metricDetails}</Text>
      </Card>
    </Card>
  );
};

export default MetricInfo;



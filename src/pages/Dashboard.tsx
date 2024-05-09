import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Select } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

import { useModel } from '@umijs/max';
import { fetchChartData} from '@/services/chartService';

const NewChartPage = () => {
    const { initialState } = useModel('@@initialState');
    const [blockchain, setBlockchain] = useState('');
    const [subChain, setSubChain] = useState('');
    const [metric, setMetric] = useState('');
    const [timeRange, setTimeRange] = useState('7_days');
    const [chartData, setChartData] = useState([]);
    const [description, setDescription] = useState("");

    // Extract blockchains from initialState
    const blockchains = Object.keys(initialState?.blockchainData || {});

    // Update subChains based on selected blockchain
    const subChains = blockchain ? Object.keys(initialState?.blockchainData[blockchain] || {}) : [];

    // Update metricsList based on selected subChain
    const metricsList = subChain ? initialState?.blockchainData[blockchain][subChain] || [] : [];

    useEffect(() => {
        if (blockchain && subChain && metric && timeRange) {
            fetchChartData(blockchain, subChain, metric, timeRange).then(response => {
                const transformedData = response.data.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    value: item.value,
                }));
                setChartData(transformedData);
                setDescription(response.data['util_data'].description || '')
            }).catch(error => {
                console.error('API call failed:', error);
            });
        }
    }, [blockchain, subChain, metric, timeRange]);
    
    
    return (
        <PageContainer>
            <Card title="Chart">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    {/* Blockchain Selector */}
                    <div>
                        <label style={{ marginRight: 10 }}>Blockchain:</label>
                        <Select style={{ width: 120 }} value={blockchain} onChange={setBlockchain}>
                            {blockchains.map(bc => (
                                <Select.Option key={bc} value={bc}>{bc}</Select.Option>
                            ))}
                        </Select>
                    </div>
                    
                    {/* Sub Chain Selector */}
                    {blockchain && (
                        <div>
                            <label style={{ marginRight: 10 }}>Sub Chain:</label>
                            <Select style={{ width: 120 }} value={subChain} onChange={setSubChain}>
                                {subChains.map(sc => (
                                    <Select.Option key={sc} value={sc}>{sc}</Select.Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {/* Metric Selector */}
                    {subChain && (
                        <div>
                            <label style={{ marginRight: 10 }}>Metric:</label>
                            <Select style={{ width: 200 }} value={metric} onChange={setMetric}>
                                {metricsList.map(m => (
                                    <Select.Option key={m} value={m}>{m}</Select.Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {/* Time Range Selector */}
                    <div>
                        <label style={{ marginRight: 10 }}>Time Range:</label>
                        <Select style={{ width: 120 }} value={timeRange} onChange={setTimeRange}>
                            <Select.Option value="7_days">7 days</Select.Option>
                            {/* Additional options can be added here */}
                        </Select>
                    </div>
                </div>

                {/* Line Chart */}
                {metric && (
                <Card>


                <LineChart
                width={1100}
                height={400}
                data={chartData}
                margin={{ top: 70, right: 0, left: 70, bottom: 0 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" strokeOpacity={0.1} />
                <XAxis
                    dataKey="date"
                    stroke="white"
                    tick={{ fill: 'yellow' }}
                >
                    <Label value="Date" offset={-10} position="insideBottomRight" fill="yellow" />
                </XAxis>
                <YAxis
                stroke="white"
                tick={{ fill: 'yellow' }}
                tickFormatter={(value) => {
                    if (value === 0) {
                    return '0';
                    }
                    const units = ['', 'K', 'M', 'B', 'T'];
                    const order = Math.floor(Math.log10(Math.abs(value)) / 3);
                    if (order > units.length - 1) {
                    return value.toExponential(2);
                    }
                    const abbreviatedValue = (value / Math.pow(1000, order)).toFixed(2);
                    return abbreviatedValue + units[order];
                }}
                >
                <Label
                    value={`${metric}`}
                    angle={-90}
                    position="insideLeft"
                    offset={-20}
                    fill="yellow"
                />
                </YAxis>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px', color: 'white' }} />
                <Legend wrapperStyle={{ color: 'yellow' }} />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="blue"
                    activeDot={{ r: 8, stroke: 'yellow', strokeWidth: 2, fill: 'yellow' }}
                    strokeWidth={2}
                    dot={{
                    stroke: 'yellow',
                    strokeWidth: 2,
                    fill: 'yellow',
                    r: 4,
                    }}
                    animationDuration={2000}
                />
                </LineChart>

                </Card>
                )}
                {/* Custom Description Div */}
                <div style={{ marginTop: 20 }}>
                    {/* Displaying dynamic description based on utilData */}
                    <p>{description}</p>
                </div>
            </Card>
        </PageContainer>
    );
};

export default NewChartPage;













// import React, { useState } from 'react';
// import { PageContainer } from '@ant-design/pro-components';
// import { Card, Select } from 'antd';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';

// const NewChartPage = () => {
//     const [blockchain] = useState('Avalanche');
//     const [subChain] = useState('x');
//     const [metric] = useState('Active address');
//     const [timeRange] = useState('7_days');
//     const [description] = useState("An active address is any wallet or account address on a blockchain that has participated in a transaction—either as a sender or receiver—within a specified time frame");

//     // Example hardcoded chart data
//     const chartData = [
//         { date: '2024-04-01', value: 83560 },
//         { date: '2024-04-02', value: 85327 },
//         { date: '2024-04-03', value: 83833 },
//         { date: '2024-04-04', value: 109301 },
//         { date: '2024-04-05', value: 96263 },
//         { date: '2024-04-06', value: 110310 },
//         { date: '2024-04-07', value: 97392 },
//     ];
    

//     return (
//         <PageContainer>
//             <Card title="Chart">
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
//                     <div>
//                         <label style={{ marginRight: 10 }}>Blockchain:</label>
//                         <Select style={{ width: 120 }} defaultValue={blockchain}>
//                             <Select.Option value="Avalanche">Avalanche</Select.Option>
//                         </Select>
//                     </div>
//                     <div>
//                         <label style={{ marginRight: 10 }}>Sub Chain:</label>
//                         <Select style={{ width: 120 }} defaultValue={subChain}>
//                             <Select.Option value="x">x</Select.Option>
//                         </Select>
//                     </div>
//                     <div>
//                         <label style={{ marginRight: 10 }}>Metric:</label>
//                         <Select style={{ width: 200 }} defaultValue={metric}>
//                             <Select.Option value="Active address">Active address</Select.Option>
//                         </Select>
//                     </div>
//                     <div>
//                         <label style={{ marginRight: 10 }}>Time Range:</label>
//                         <Select style={{ width: 120 }} defaultValue={timeRange}>
//                             <Select.Option value="7_days">7 days</Select.Option>
//                         </Select>
//                     </div>
//                 </div>

//                 <Card>
//                     <LineChart
//                         width={1100}
//                         height={400}
//                         data={chartData}
//                         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//                     >
//                         <CartesianGrid strokeDasharray="3 3" stroke="#eeeeee" />
//                         <XAxis dataKey="date" stroke="white" tick={{ fill: 'yellow' }}>
//                             <Label value="Date" offset={-20} position="insideBottomRight" fill="yellow" />
//                         </XAxis>
//                         <YAxis stroke="white" tick={{ fill: 'yellow' }}>
//                             <Label value={`${metric} Value`} angle={-90} position="insideLeft" offset={-15} fill="yellow" />
//                         </YAxis>
//                         <Tooltip />
//                         <Legend wrapperStyle={{ color: 'yellow' }} />
//                         <Line type="monotone" dataKey="value" stroke="blue" activeDot={{ r: 8, stroke: 'yellow', strokeWidth: 2, fill: 'yellow' }} strokeWidth={2} dot={{ stroke: 'yellow', strokeWidth: 2, fill: 'yellow', r: 4 }} />
//                     </LineChart>
//                 </Card>

//                 <div style={{ marginTop: 20 }}>
//                     <p>{description}</p>
//                 </div>
//             </Card>
//         </PageContainer>
//     );
// };

// export default NewChartPage;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { hour: '1 AM', Happiness: 400, Sadness: 240, Anger: 240 },
  { hour: '2 AM', Happiness: 300, Sadness: 139, Anger: 221 },
  { hour: '3 AM', Happiness: 200, Sadness: 980, Anger: 229 },
  // Add more data points here
];

const MyLineChart = () => (
  <LineChart
    width={500}
    height={300}
    data={data}
    margin={{
      top: 5, right: 30, left: 20, bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="hour" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="Happiness" stroke="#8884d8" />
    <Line type="monotone" dataKey="Sadness" stroke="#82ca9d" />
    <Line type="monotone" dataKey="Anger" stroke="#ffc658" />
    {/* Add more lines for additional emotions as needed */}
  </LineChart>
);

export default MyLineChart;

// BarChartComponent.js

import React from 'react';
import PropTypes from 'prop-types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

const BarChartComponent = ({ title, subheader, dataset, xAxis, series, ...chartSetting }) => {
  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          data={dataset}
          layout="vertical" // Adjusted for horizontal layout
          {...chartSetting}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={xAxis.dataKey} width={120} /> // Adjusted for horizontal
          layout
          <Tooltip />
          <Legend />
          {series.map(({ dataKey, label, fill }, index) => (
            <Bar
              key={index}
              dataKey={dataKey}
              name={label}
              fill={fill}
              // Removed stackId to unstack the bars
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

BarChartComponent.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  dataset: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxis: PropTypes.shape({
    dataKey: PropTypes.string.isRequired
  }).isRequired,
  series: PropTypes.arrayOf(PropTypes.shape({
    dataKey: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    fill: PropTypes.string
  })).isRequired,
  chartSetting: PropTypes.object
};

export default BarChartComponent;

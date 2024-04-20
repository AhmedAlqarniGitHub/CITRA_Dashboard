import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { ChartSelectionsContext } from './chart-selections-context';

// Define colors for emotions
const emotionColors = {
  happy: '#FFD700', // Gold
  sad: '#1E90FF', // DodgerBlue
  disgusted: '#008000', // Green
  surprised: '#FF69B4', // HotPink
  neutral: '#A52A2A', // Brown
  fearful: '#800080', // Purple
  angry: '#FF0000', // Red
};

const BarChartComponent = ({
  title,
  subheader,
  dataset,
  xAxis,
  series,
  ...chartSetting
}) => {
  const eventNames = dataset.map(item => item.event);
  const { selections } = useContext(ChartSelectionsContext);

  const [selectedEvents, setSelectedEvents] = useState(eventNames.slice(0, 3));

  useEffect(() => {
    const eventNames = dataset.map(item => item.event);
    setSelectedEvents(eventNames.slice(0, 3));
  }, [dataset]);

  const handleEventChange = (event) => {
    const value = event.target.value;
    if (value.length <= 3) {
      setSelectedEvents(value);
    }
  };

  const filteredDataset = dataset.filter(item => selectedEvents.includes(item.event));

  // Applying consistent color based on emotion
  const coloredSeries = series.map(serie => ({
    ...serie,
    fill: emotionColors[serie.label] || '#000000', // Default to black if not specified
  }));

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 2 }}>
        <FormControl fullWidth style={{ paddingBlockStart: '1vh' }}>
          <InputLabel id="event-select-label">Select Events</InputLabel>
          <Select
            labelId="event-select-label"
            multiple
            label="Select Events"
            value={selectedEvents}
            onChange={handleEventChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {eventNames.map(event => (
              <MenuItem key={event} value={event}>
                <Checkbox checked={selectedEvents.includes(event)} />
                <ListItemText primary={event} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ResponsiveContainer className="pdf-section" width="95%" height="66%">
        <BarChart
          data={filteredDataset}
          layout="vertical"
          {...chartSetting}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={xAxis.dataKey} width={120} />
          <Tooltip />
          <Legend />
          {coloredSeries.map(({ dataKey, label, fill }) => (
            <Bar key={dataKey} dataKey={dataKey} name={label} fill={fill} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

BarChartComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  dataset: PropTypes.arrayOf(PropTypes.object).isRequired,
  xAxis: PropTypes.shape({
    dataKey: PropTypes.string.isRequired,
  }).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      fill: PropTypes.string,
    })
  ).isRequired,
};

export default BarChartComponent;

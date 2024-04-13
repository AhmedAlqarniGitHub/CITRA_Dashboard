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

const BarChartComponent = ({
  isGeneratingPDF,
  title,
  subheader,
  dataset,
  xAxis,
  series,
  ...chartSetting
}) => {
  // Extract event names from dataset
  const eventNames = dataset.map((item) => item.event);
  const { selections } = useContext(ChartSelectionsContext);

  // State for selected events
  const [selectedEvents, setSelectedEvents] = useState(eventNames.slice(0, 3));
  const [oldSelectedEvents, setOldSelectedEvents] = useState(eventNames.slice(0, 3));

  // Extract event names from dataset and set initial selected events
  useEffect(() => {
    if (isGeneratingPDF) {
      setOldSelectedEvents(selectedEvents);
      setSelectedEvents(selections.emotionDistributionEvents);
    } else {
      setSelectedEvents(oldSelectedEvents);
    }
  }, [isGeneratingPDF]);

  // Extract event names from dataset and set initial selected events
  // useEffect(() => {
  //   const eventNames = dataset.map((item) => item.event);
  //   if (isGeneratingPDF) {
  //     setOldSelectedEvents(eventNames.slice(0, 3));
  //     setSelectedEvents(selections.emotionDistributionEvents || eventNames.slice(0, 3));
  //   } else {
  //     setSelectedEvents(eventNames.slice(0, 3));
  //     setOldSelectedEvents(eventNames.slice(0, 3));
  //   }
  // }, []);

  // Extract event names from dataset and set initial selected events
  useEffect(() => {
    const eventNames = dataset.map((item) => item.event);
    setSelectedEvents(eventNames.slice(0, 3));
    setOldSelectedEvents(eventNames.slice(0, 3));
  }, [dataset]);

  const handleEventChange = (event) => {
    const value = event.target.value;
    // Limit to a maximum of 3 selected events
    if (value.length <= 3) {
      setSelectedEvents(value);
    }
  };

  // Filter the dataset based on selected events
  const filteredDataset = dataset.filter((item) => selectedEvents.includes(item.event));

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ p: 2 }}>
        <FormControl fullWidth style={{ paddingBlockStart: '1vh' }}>
          <InputLabel id="event-select-label">Select Events</InputLabel>
          <Select
            labelId="event-select-label"
            multiple
            value={selectedEvents}
            onChange={handleEventChange}
            renderValue={(selected) => selected.join(', ')}
          >
            {eventNames.map((event) => (
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
          // className="pdf-section"
          data={filteredDataset}
          layout="vertical"
          {...chartSetting}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey={xAxis.dataKey} width={120} />
          <Tooltip />
          <Legend />
          {series.map(({ dataKey, label, fill }) => (
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
  chartSetting: PropTypes.object,
};

export default BarChartComponent;

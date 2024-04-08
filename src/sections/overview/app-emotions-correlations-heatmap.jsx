import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
} from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const periods = [
  '00:00-02:00',
  '02:00-04:00',
  '04:00-06:00',
  '06:00-08:00',
  '08:00-10:00',
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
  '20:00-22:00',
  '22:00-00:00',
];

const EmotionsHeatmapWithSelectors = ({ heatmapData, events }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedPeriods, setSelectedPeriods] = useState([]);

  useEffect(() => {
    // Set the initial state based on the first event if available
    if (events && events.length > 0) {
      setSelectedEvent(events[0]);
    }
    // Initialize months and periods as empty arrays
    setSelectedMonths([]);
    setSelectedPeriods([]);
  }, [events]); // This effect runs when the 'events' prop changes

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonths(event.target.value);
  };

  const handlePeriodChange = (event) => {
    setSelectedPeriods(event.target.value);
  };

  console.log(events);

  // Ensure data validity before processing
  if (
    !events ||
    events.length === 0 ||
    !heatmapData ||
    !months ||
    !periods ||
    selectedEvent === ''
  ) {
    return <div>No data available or data is incomplete.</div>;
  }

  // Filter data
  const filteredData = (
    heatmapData[selectedEvent] ? Object.entries(heatmapData[selectedEvent]) : []
  )
    .filter(([month]) => selectedMonths.length === 0 || selectedMonths.includes(month))
    .flatMap(([month, periodData]) =>
      Object.entries(periodData)
        .filter(([period]) => selectedPeriods.length === 0 || selectedPeriods.includes(period))
        .flatMap(([period, emotionCounts]) =>
          Object.entries(emotionCounts).map(([emotion, count]) => ({
            month,
            period,
            emotion,
            count,
          }))
        )
    );

  return (
    <Card>
      <CardHeader title="Emotions Heatmap" subheader="Select options to view data" />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="event-select-label">Event</InputLabel>
            <Select labelId="event-select-label" value={selectedEvent} onChange={handleEventChange}>
              {events.map((event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="month-select-label">Month</InputLabel>
            <Select
              labelId="month-select-label"
              multiple
              value={selectedMonths}
              onChange={handleMonthChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  <Checkbox checked={selectedMonths.includes(month)} />
                  <ListItemText primary={month} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="period-select-label">Period</InputLabel>
            <Select
              labelId="period-select-label"
              multiple
              value={selectedPeriods}
              onChange={handlePeriodChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {periods.map((period) => (
                <MenuItem key={period} value={period}>
                  <Checkbox checked={selectedPeriods.includes(period)} />
                  <ListItemText primary={period} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            layout="vertical"
            data={filteredData}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            <XAxis type="number" />
            <YAxis dataKey="emotion" type="category" />
            <Tooltip />
            <Legend />
            {periods.map((period, idx) => (
              <Bar
                key={idx}
                dataKey={period}
                stackId="a"
                // fill={/* choose color based on period */}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default EmotionsHeatmapWithSelectors;

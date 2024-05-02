import React, { useState, useEffect, useContext } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
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
import { styled } from '@mui/material/styles';
import { ChartSelectionsContext } from './chart-selections-context';

// Styled components
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 240,
  '& .MuiOutlinedInput-input': {
    color: theme.palette.text.primary,
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.text.secondary,
  },
}));

const InteractiveLineChart = ({ title, subheader, completeEventData, events, emotions }) => {
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const { selections, appSelections, updateAppSelections } = useContext(ChartSelectionsContext);

  useEffect(() => {
    const sortedEmotions = [...emotions].sort(); // Sorting emotions alphabetically
    if (appSelections.lineChartEvents.length > 0 && appSelections.lineChartEmotions.length > 0) {
      setSelectedEvents(appSelections.lineChartEvents);
      setSelectedEmotions(appSelections.lineChartEmotions); // Default
    } else {
      setSelectedEvents(events.slice(0, 3));
      setSelectedEmotions(sortedEmotions.slice(0, 3)); // Default
      updateAppSelections({
        lineChartEvents: events.slice(0, 3),
        lineChartEmotions: sortedEmotions.slice(0, 3),
      });
    }
  }, [events, emotions]);

  useEffect(() => {
    if (appSelections.lineChartEvents.length > 0 && appSelections.lineChartEmotions.length > 0) {
      setSelectedEvents(appSelections.lineChartEvents);
      setSelectedEmotions(appSelections.lineChartEmotions); // Default
    }
  }, [appSelections]);

  // Event handler for emotion selection
  const handleEmotionChange = (event) => {
    const value = event.target.value;
    setSelectedEmotions(value);
    updateAppSelections({
      lineChartEmotions: value,
    });
  };

  // Event handler for event name selection
  const handleEventChange = (event) => {
    const value = event.target.value;
    if (value.length <= 3) {
      setSelectedEvents(value);
      updateAppSelections({
        lineChartEvents: value,
      });
    }
  };

  // Transform the dataset for the selected events and emotions
  const transformedData = completeEventData.map((monthData) => {
    let count = 0;
    selectedEvents.forEach((event) => {
      if (!monthData[event]) {
        return;
      }
      selectedEmotions.forEach((emotion) => {
        if (monthData[event][emotion] === undefined) {
          return;
        }
        count += monthData[event][emotion] || 0; // Add 0 if the value is undefined
      });
    });
    return { month: monthData.month, count };
  });

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />
      <ResponsiveContainer className="pdf-section" width="95%" height={400}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <CardContent>
        <Box display="flex" justifyContent="center" flexWrap="wrap-reverse">
          <StyledFormControl variant="outlined">
            <InputLabel id="emotion-label">Emotion</InputLabel>
            <Select
              labelId="emotion-label"
              multiple
              label="Emotion"
              value={selectedEmotions}
              onChange={handleEmotionChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {emotions.map((emotion) => (
                <MenuItem key={emotion} value={emotion}>
                  <Checkbox checked={selectedEmotions.indexOf(emotion) > -1} />
                  <ListItemText primary={emotion} />
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl variant="outlined">
            <InputLabel id="event-label">Event</InputLabel>
            <Select
              labelId="event-label"
              multiple
              label="Event"
              value={selectedEvents}
              onChange={handleEventChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {events.map((event) => (
                <MenuItem key={event} value={event}>
                  <Checkbox checked={selectedEvents.indexOf(event) > -1} />
                  <ListItemText primary={event} />
                </MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InteractiveLineChart;

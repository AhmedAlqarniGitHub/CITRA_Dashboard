import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

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
  const [selectedEmotion, setSelectedEmotion] = useState(emotions[0]);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  // Event handler for emotion selection
  const handleEmotionChange = (event) => {
    setSelectedEmotion(event.target.value);
  };

  // Event handler for event name selection
  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  // Transform the dataset for the selected event and emotion
  const transformedData = completeEventData.map(monthData => ({
    month: monthData.month,
    count: monthData[selectedEvent][selectedEmotion],
  }));

  return (
    <Card>
      <CardHeader title={title} subheader={subheader} />
      <ResponsiveContainer width="100%" height={400}>
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
        <Box display="flex" justifyContent="center" flexWrap="wrap">
          <StyledFormControl variant="outlined">
            <InputLabel id="emotion-label">Emotion</InputLabel>
            <Select
              labelId="emotion-label"
              value={selectedEmotion}
              onChange={handleEmotionChange}
              label="Emotion"
            >
              {emotions.map((emotion) => (
                <MenuItem key={emotion} value={emotion}>{emotion}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
          <StyledFormControl variant="outlined">
            <InputLabel id="event-label">Event</InputLabel>
            <Select
              labelId="event-label"
              value={selectedEvent}
              onChange={handleEventChange}
              label="Event"
            >
              {events.map((event) => (
                <MenuItem key={event} value={event}>{event}</MenuItem>
              ))}
            </Select>
          </StyledFormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InteractiveLineChart;

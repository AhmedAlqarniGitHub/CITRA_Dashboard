import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import GaugeChart from 'react-gauge-chart';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://localhost:3000';

const AppSatisfactionGauge = ({ title }) => {
  const [satisfactionData, setSatisfactionData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedSatisfaction, setSelectedSatisfaction] = useState(0);

  useEffect(() => {
    const fetchSatisfactionData = async () => {
      const user = { id: localStorage.getItem('id') };
      try {
        const response = await axios.get(`${apiBaseUrl}/events/satisfaction/${user.id}`);
        const data = response.data;
        // Store data in state
        setSatisfactionData(data);

        const storedSelection = localStorage.getItem('eventSatisfactionEventSelection');
        const selected = storedSelection ? JSON.parse(storedSelection) : (data.length > 0 ? data[0].eventId : '');

        if (storedSelection && selected !== selectedEvent) {
          setSelectedEvent(selected);
          const eventData = data.find(d => d.eventId === selected);
          setSelectedSatisfaction(eventData ? eventData.satisfaction : 0);
        } else if (!storedSelection && data.length > 0) {
          // Use the first event as default if no storage and data is available
          setSelectedEvent(data[0].eventId);
          setSelectedSatisfaction(data[0].satisfaction);
        }
      } catch (error) {
        console.error('Error fetching satisfaction data:', error);
      }
    };

    fetchSatisfactionData();
  }, []);

  useEffect(() => {
    // Only update the satisfaction value if the event data changes
    const eventData = satisfactionData.find(d => d.eventId === selectedEvent);
    const newSatisfaction = eventData ? eventData.satisfaction : 0;
    if (newSatisfaction !== selectedSatisfaction) {
      setSelectedSatisfaction(newSatisfaction);
    }
  }, [selectedEvent, satisfactionData]);

  const handleEventChange = (event) => {
    const newEventId = event.target.value;
    localStorage.setItem('eventSatisfactionEventSelection', JSON.stringify(newEventId));
    setSelectedEvent(newEventId);
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} />
      <Box sx={{ p: 2, pt: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel id="event-select-label">Event</InputLabel>
          <Select
            labelId="event-select-label"
            value={selectedEvent}
            label="Event"
            onChange={handleEventChange}
          >
            {satisfactionData.map((data) => (
              <MenuItem key={data.eventId} value={data.eventId}>
                {data.eventName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={20}
            colors={['#FF0000', '#00FF00']}
            needleColor="#032736"
            percent={selectedSatisfaction / 100} // Convert to a value between 0 and 1
            textColor="#000000"
            animate={false}
          />
          <Typography variant="h6" component="div" color="text.secondary" sx={{ mt: 1 }}>
            {`${Math.round(selectedSatisfaction)}% Satisfaction`}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

AppSatisfactionGauge.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppSatisfactionGauge;

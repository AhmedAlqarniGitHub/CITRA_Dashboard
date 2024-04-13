import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import GaugeChart from 'react-gauge-chart'; // Reusing GaugeChart
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

        setSatisfactionData(data);
        // Check local storage for saved selection
        const storedSelection = JSON.parse(localStorage.getItem('eventSatisfactionEventSelection'));
        if (storedSelection) {
          setSelectedEvent(storedSelection);
          const eventData = data.find((d) => d.eventId === storedSelection);
          setSelectedSatisfaction(eventData ? eventData.satisfaction : 0);
        } else if (data.length > 0) {
          // Use the first event as default
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
    // Update satisfaction value when selected event changes
    const eventData = satisfactionData.find((d) => d.eventId === selectedEvent);
    setSelectedSatisfaction(eventData ? eventData.satisfaction : 0);
  }, [selectedEvent, satisfactionData]);

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title={title} />
      <div style={{ padding: '20px', paddingTop: '2.5vh' }}>
        <Select
          value={selectedEvent}
          onChange={handleEventChange}
          displayEmpty
          fullWidth
          inputProps={{ 'aria-label': 'Select Event' }}
        >
          {satisfactionData.map((data) => (
            <MenuItem key={data.eventId} value={data.eventId}>
              {data.eventName}
            </MenuItem>
          ))}
        </Select>
        <Box
          className="pdf-section"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}
        >
          <GaugeChart
            id="gauge-chart"
            nrOfLevels={20}
            colors={['#FF0000', '#00FF00']}
            hideText
            needleColor="#032736"
            percent={selectedSatisfaction / 100} // Convert to a value between 0 and 1
            textColor="#000000"
          />
          <Typography variant="h6" component="div" color="text.secondary" sx={{ mt: 1 }}>
            {`${Math.round(selectedSatisfaction)}% Satisfaction`}
          </Typography>
        </Box>
      </div>
    </Card>
  );
};

AppSatisfactionGauge.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AppSatisfactionGauge;

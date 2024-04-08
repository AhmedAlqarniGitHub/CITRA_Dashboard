import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, MenuItem, FormControl, InputLabel, Select, Card, CardContent, Box, Grid, Paper } from '@mui/material';
import completeEventData from "../../_mock/event_barChart_cont";

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function InsightsComponent() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [response, setResponse] = useState('');

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const events = Object.keys(completeEventData[0]).filter(key => key !== 'month');

  const questions = [
    "Summarize all-time user emotions in the event",
    "Summarize user emotions in a specific month of a specific event",
    "Overall observations for a specific event",
    "Recommendations for the organizer team to improve user satisfaction"
  ];

  const monthMapping = {
    "January": "Jan",
    "February": "Feb",
    "March": "Mar",
    "April": "Apr",
    "May": "May",
    "June": "Jun",
    "July": "Jul",
    "August": "Aug",
    "September": "Sep",
    "October": "Oct",
    "November": "Nov",
    "December": "Dec"
  };
  

  const generatePrompt = (question, event, month) => {

    
   
    const selectedData= generatePromptForSpecificMonthAndEvent(completeEventData, selectedEvent, selectedMonth)
    console.log("selectedData: "+ selectedData)
    switch (question) {
      case questions[0]:
        return `Analyze the comprehensive facial emotion detection data across all events and summarize the predominant user emotions observed.`;
      case questions[1]:
        return `Given the facial emotion detection data ,${selectedData},for ${event} in ${month}, summarize the predominant user emotions observed during this period. 
        the answer should be in JSON format with the following keys {Event,Month,Visitors emotions: {Happy: ,Neutral: ,Surprised: ,Angry: ,Sad:, Fearful: },"insights: }}
        insights should be as polit points max 5 points and it should based on the data provided which aimed to summarize it `;
      case questions[2]:
        return `Review the facial emotion detection data for ${event} and provide a comprehensive overview of the user emotions detected.`;
      case questions[3]:
        return `Based on the analysis of facial emotion detection data, suggest actionable recommendations for event organizers to enhance user satisfaction.`;
      default:
        return '';
    }
  };



  const generatePromptForSpecificMonthAndEvent = (eventData, eventName, monthName) => {
    // Find the specific event data for the selected month
    const eventMonthData = eventData.find(data => data.month === monthMapping[monthName]);
    if (!eventMonthData) return '';

    // Extract the event data
    const specificEventData = eventMonthData[eventName];
    if (!specificEventData) return '';

    // Convert data to JSON string format
    return JSON.stringify({
      event: eventName,
      month: monthName,
      user_emotions: specificEventData
    });
  };


  const handleGenerateInsights = async () => {
    const prompt = generatePrompt(selectedQuestion, selectedEvent, selectedMonth);
    console.log("prompt: "+ prompt)
    try {
      const res = await axios.post(`${apiBaseUrl}/actions/generate-text`, { prompt });
      console.log(res.data);
      setResponse(res.data);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  const renderResponse = (response) => {
    if (typeof response !== 'object') {
      try {
        response = JSON.parse(response);
      } catch (e) {
        console.error("Couldn't parse the response as JSON:", e);
        return <Typography variant="body1">{response}</Typography>;
      }
    }
  
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 1, bgcolor: 'grey.200' }}>
        {Object.entries(response).map(([key, value], index) => (
          <Box key={key} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Typography>
            {typeof value === 'object' ? (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'common.white' }}>
                {Object.entries(value).map(([innerKey, innerValue], idx) => (
                  <Typography key={innerKey} variant="body1" sx={{ color: 'text.secondary' }}>
                    {innerKey.charAt(0).toUpperCase() + innerKey.slice(1)}: {innerValue}
                  </Typography>
                ))}
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'common.white' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {value}
                </Typography>
              </Paper>
            )}
          </Box>
        ))}
      </Paper>
    );
  };
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Insights Generator</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Question</InputLabel>
            <Select value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
              {questions.map((question, index) => (
                <MenuItem key={index} value={question}>{question}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedQuestion === questions[1] && (
            <Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Month</InputLabel>
                <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {months.map(month => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Event</InputLabel>
                <Select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                  {events.map(event => (
                    <MenuItem key={event} value={event}>{event}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Button variant="contained" onClick={handleGenerateInsights}>Generate Insights</Button>
          {response && selectedQuestion === questions[1] ? (

            <Box sx={{ mt: 2 }}>
              {renderResponse(response)}
            </Box>

          ) :
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>{response}</Typography>
          }
        </CardContent>
      </Card>
    </Container>
  );
}
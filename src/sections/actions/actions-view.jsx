import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, Button, MenuItem, FormControl, InputLabel, Select, Card, CardContent } from '@mui/material';
import completeEventData from "../../_mock/event_barChart_cont";

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function InsightsComponent() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [response, setResponse] = useState('');

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const events = Object.keys(completeEventData[0]).filter(key => key !== 'month'); // Assuming 'month' is a key in your data structure

  const questions = [
    "Summarize all-time user emotions in the event",
    "Summarize user emotions in a specific month of a specific event",
    "Overall observations for a specific event",
    "Recommendations for the organizer team to improve user satisfaction"
  ];

  const handleGenerateInsights = async () => {
    // Here, you would formulate the prompt based on the selected question, month, and event
    // For simplicity, the below line is just a placeholder
    const prompt = `Based on the selected options: Question: ${selectedQuestion}, Month: ${selectedMonth}, Event: ${selectedEvent}`;

    try {
      const res = await axios.post(`${apiBaseUrl}/actions/generate-text`, { prompt });
      setResponse(res.data); // Assuming the response structure
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Insights Generator
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose a Question</InputLabel>
            <Select
              value={selectedQuestion}
              label="Choose a Question"
              onChange={(e) => setSelectedQuestion(e.target.value)}
            >
              {questions.map((question, index) => (
                <MenuItem key={index} value={question}>{question}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedQuestion.includes("specific month") && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  label="Month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Event</InputLabel>
                <Select
                  value={selectedEvent}
                  label="Event"
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {events.map((event) => (
                    <MenuItem key={event} value={event}>{event}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <Button variant="contained" onClick={handleGenerateInsights}>
            Generate Insights
          </Button>

          {response && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
              {response}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

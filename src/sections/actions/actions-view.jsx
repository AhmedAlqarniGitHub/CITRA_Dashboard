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
    "Summarize all-time user emotions in all the event",
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
    console.log("Month: ", month, "Event: ", event);
    const questionNumber = questions.indexOf(question) + 1;
  
    const selectedData = generatePromptForSpecificMonthAndEvent(completeEventData, selectedEvent, selectedMonth, questionNumber);
    console.log("SelectedData: ", selectedData);
  
    switch (questionNumber) {
      case 1:
        return `Analyze the comprehensive facial emotion detection data across all events and summarize the predominant user emotions observed. Data: ${selectedData}. Please format your response as follows: { "Predominant_Emo­tions": ["Happy", "Surprised"], "Insights": ["Emotion A is predominant due to...", "An unexpected trend is..."] }.`;
  
      case 2:
        return `Given the facial emotion detection data for ${event} in ${month}: ${selectedData}, summarize the predominant user emotions observed. Ensure your answer is in JSON format with the following keys: { "Event": "${event}", "Month": "${month}", "Visitors Emotions": {"Happy": 0, "Neutral": 0}, "Insights": ["Point 1", "Point 2"] }. Example: { "Event": "Music Festival", "Month": "June", "Visitors Emotions": {"Happy": 120, "Neutral": 50}, "Insights": ["Majority of attendees felt happy", "Neutral emotions were primarily due to waiting times."] }.`;
  
      case 3:
        return `Based on the facial emotion detection data for ${event}, analyze the spectrum of emotions exhibited by attendees across all months. Data: ${selectedData}. Organize your insights into JSON format: { "Event": "${event}", "Emotions_Per_Month": {...}, "Insights": ["Point 1", "Point 2", "Point 3"] }. Example: { "Event": "Art Exhibition", "Emotions_Per_Month": {"January": {"Happy": 100, "Sad": 20}, "February": {"Happy": 150, "Sad": 25}}, "Insights": ["Happiness increased in February", "Sadness remained relatively constant", "Suggest more interactive exhibits to boost positive emotions."] }.`;
  
      case 4:
        return `Based on the analysis of facial emotion detection data, suggest actionable recommendations for event organizers to enhance user satisfaction for ${event}. Consider the data: ${selectedData}. Format your recommendations as follows: { "Event": "${event}", "Recommendations": ["Recommendation 1", "Recommendation 2"] }. Example: { "Event": "Tech Conference", "Recommendations": ["Increase interactive sessions to boost engagement", "Introduce relaxation zones to help attendees recharge."] }. Not you have to answer with the json object only `;
  
      default:
        return '';
    }
  };
  



  const generatePromptForSpecificMonthAndEvent = (eventData, eventName, monthName, questionNumber) => {
    switch (questionNumber) {
      case 1:
      case 4:
        // For questions 1 and 4, return the complete data as is
        return JSON.stringify(eventData);
      case 2:
        // For question 2, find and return data for the specific month and event
        const eventMonthData = eventData.find(data => data.month === monthMapping[monthName]);
        if (!eventMonthData) return '';
  
        const specificEventData = eventMonthData[eventName];
        if (!specificEventData) return '';
  
        return JSON.stringify({
          event: eventName,
          month: monthName,
          user_emotions: specificEventData
        });
      case 3:
        // For question 3, create an array with emotions for each month for the selected event
        const monthlyEmotionsData = eventData.map(monthData => {
          const monthEventData = monthData[eventName];
          const monthName = monthData.month;
          // If there's no data for the event in this month, return an empty object for this month
          if (!monthEventData) {
            return { [monthName]: {} };
          }
  
          return { [monthName]: monthEventData };
        });
  
        return JSON.stringify(monthlyEmotionsData);
      default:
        return '';
    }
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
    let responseData;
  
    try {
      responseData = JSON.parse(response);
    } catch (e) {
      console.error("Couldn't parse the response as JSON:", e);
      return <Typography variant="body1">{response}</Typography>;
    }
  
    return (
      <Paper elevation={2} sx={{ p: 2, mb: 1, bgcolor: 'grey.200' }}>
        {Object.entries(responseData).map(([key, value], index) => {
          // Convert object keys like "Emotions_Per_Month" to a more readable format
          let formattedKey = key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
          
          // Check if the value is an object and not an array (arrays are also objects in JavaScript)
          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // It's an object, so we need to render its entries
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {formattedKey}:
                </Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'common.white' }}>
                  {Object.entries(value).map(([subKey, subValue], subIdx) => (
                    <Typography key={subIdx} variant="body1" sx={{ color: 'text.secondary' }}>
                      {subKey.charAt(0).toUpperCase() + subKey.slice(1)}: {subValue.toString()}
                    </Typography>
                  ))}
                </Paper>
              </Box>
            );
          } else if (Array.isArray(value)) {
            // It's an array, so we can render its elements directly
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {formattedKey}:
                </Typography>
                {value.map((item, idx) => (
                  <Paper key={idx} elevation={0} sx={{ p: 2, bgcolor: 'common.white', mt: idx > 0 ? 1 : 0 }}>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {item}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            );
          } else {
            // The value is neither an object nor an array, so we can render it directly
            return (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {formattedKey}:
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {value.toString()}
                </Typography>
              </Box>
            );
          }
        })}
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
  
          {/* For Question 2 */}
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
  
          {/* For Question 3 */}
          {selectedQuestion === questions[2] && (
            <Box>
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
          {response &&
            <Box sx={{ mt: 2 }}>
              {renderResponse(response)}
            </Box>
                    }
        </CardContent>
      </Card>
    </Container>
  );
  
}
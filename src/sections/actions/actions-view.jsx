import React, { useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Button, MenuItem, FormControl, InputLabel, Select, Card, CardContent, Box,
  CircularProgress, Paper
} from '@mui/material';
import completeEventData from "../../_mock/event_barChart_cont";

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function InsightsComponent() {
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state for tracking loading status


  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const events = Object.keys(completeEventData[0]).filter(key => key !== 'month');

  const questions = [
    "Provide a summary of the most common user emotions observed at all events over time",
    "Detail the user emotions observed during a specific event in a given month",
    "Offer a comprehensive overview of attendee emotions for a selected event",
    "Present recommendations to enhance attendee satisfaction based on event data."
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

    switch (questionNumber) {
      case 1:
        return `Please analyze the aggregated facial emotion detection data across all events and provide a summary of the predominant emotions that have been observed. Include the data: ${selectedData}. The response should be structured in JSON format with the keys "Predominant_Emotions" and "Insights", for example: { "Predominant_Emotions": ["Happy", "Surprised"], "Insights": ["The most frequent emotion is...", "There was a notable trend..."] }.`;

      case 2:
        return `Examine the facial emotion detection data for ${event} in the month of ${month}: ${selectedData}, and summarize the main emotions detected among attendees. Your summary should be in JSON format with the keys "Event", "Month", "Visitors Emotions", and "Insights". For instance: { "Event": "${event}", "Month": "${month}", "Visitors Emotions": {"Happy": 120, "Neutral": 50}, "Insights": ["The dominant emotion was happiness", "Neutral expressions were largely due to the wait times."] }.`;

      case 3:
        return `Analyze the emotional data for ${event} over all available months. Data: ${selectedData}. Organize your analysis into JSON format, with keys for "Event", "Emotions_Per_Month", and "Insights". For example: { "Event": "${event}", "Emotions_Per_Month": {"January": {"Happy": 100, "Sad": 20}, "February": {"Happy": 150, "Sad": 25}}, "Insights": ["An uptick in happiness was noted in February", "Sadness levels remained fairly consistent", "Interactive exhibits are recommended to further enhance positivity."] }.`;

      case 4:
        return `Review the facial emotion detection data and propose actionable steps that event organizers can take to improve attendee satisfaction at ${event}. The data provided: ${selectedData}, should guide your recommendations. Please respond with a JSON object only, including keys "Event" and "Recommendations", like this: { "Event": "${event}", "Recommendations": ["To foster engagement, add more interactive sessions", "Incorporate relaxation areas to allow attendees to recharge."] }.`;

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
    setIsLoading(true); // Start loading
    const prompt = generatePrompt(selectedQuestion, selectedEvent, selectedMonth);
    console.log("prompt: " + prompt)
    try {
      const res = await axios.post(`${apiBaseUrl}/actions/generate-text`, { prompt });
      console.log(res.data);
      setResponse(res.data);
    } catch (error) {
      console.error('Error generating insights:', error);
    }
    finally {
      setIsLoading(false); // Stop loading regardless of the result
    }
  };

  const renderResponse = (response) => {
    let responseData;
    let preJsonText = "";

     // Attempt to isolate the JSON part of the response
     const jsonStartIndex = response.indexOf('{');
     const jsonEndIndex = response.lastIndexOf('}') + 1; // +1 to include the closing bracket
     if (jsonStartIndex > -1 && jsonEndIndex > jsonStartIndex) {
         preJsonText = response.substring(0, jsonStartIndex);
         response = response.substring(jsonStartIndex, jsonEndIndex); // Isolate the JSON part
     }

    try {
      responseData = JSON.parse(response);
    } catch (e) {
      console.error("Couldn't parse the response as JSON:", e);
      return <Typography variant="body1">{response}</Typography>;
    }

    return (
      <Container>
        {/* Display prefatory text under "Observations", if any */}
        {preJsonText && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Observations:</Typography>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'common.white' }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{preJsonText}</Typography>
            </Paper>
          </Box>
        )}

        {/* Render the JSON response */}
        {Object.entries(responseData).map(([key, value], index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {formatKey(key)}:
            </Typography>
            <Paper elevation={2} sx={{ p: 2, bgcolor: 'common.white' }}>
              {/* Check the value type and render accordingly */}
              {typeof value === 'object' && !Array.isArray(value) ? (
                renderObjectValue(value)
              ) : Array.isArray(value) ? (
                <ul style={{ padding: 0, listStylePosition: 'inside' }}>
                  {value.map((item, idx) => (
                    <li key={idx}>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'inline' }}>
                        {item}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  {value.toString()}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Container>
    );
  };

  // Include the helper functions here as before...


  // Place helper functions renderKeyValue, formatKey, renderObjectValue, and renderArrayValue here


  // Place helper functions renderKeyValue, formatKey, renderObjectValue, and renderArrayValue here


  // Helper function to render key-value pairs
  function renderKeyValue(key, value, index) {
    const formattedKey = formatKey(key);
    return (
      <Box key={index} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {formattedKey}:
        </Typography>
        {typeof value === 'object' && !Array.isArray(value) ? (
          renderObjectValue(value)
        ) : Array.isArray(value) ? (
          renderArrayValue(value)
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {value.toString()}
          </Typography>
        )}
      </Box>
    );
  }

  // Helper function to format keys
  function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  // Helper function to render object values
  function renderObjectValue(value) {
    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'common.white' }}>
        {Object.entries(value).map(([subKey, subValue], subIdx) => (
          <Typography key={subIdx} variant="body1" sx={{ color: 'text.secondary' }}>
            {formatKey(subKey)}: {typeof subValue === 'object' ? JSON.stringify(subValue) : subValue.toString()}
          </Typography>
        ))}
      </Paper>
    );
  }

  // Helper function to render array values
  function renderArrayValue(value) {
    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'common.white' }}>
        {value.map((item, idx) => (
          <Typography key={idx} variant="body1" sx={{ color: 'text.secondary' }}>
            {JSON.stringify(item)}
          </Typography>
        ))}
      </Paper>
    );
  }





  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>Insights Generator</Typography>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Question</InputLabel>
            <Select label={"Question"} value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
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
                <Select label={"Month"} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                  {months.map(month => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Event</InputLabel>
                <Select label={"Event"} value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
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
                <Select label={"Event"} value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}>
                  {events.map(event => (
                    <MenuItem key={event} value={event}>{event}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <Button variant="contained" onClick={handleGenerateInsights} disabled={isLoading}>
            Generate Insights
          </Button>
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              <CircularProgress /> {/* Loading spinner */}
            </Box>
          )}
          {!isLoading && response && (
            <Box sx={{ mt: 2 }}>
              {renderResponse(response)}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );

}
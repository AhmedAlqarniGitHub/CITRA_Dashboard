import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';


const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export default function InsightsComponent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const generateText = async () => {
    try {
      const res = await axios.post(`${apiBaseUrl}/actions/generate-text`, { prompt });
      setResponse(res.data.choices[0].text);
    } catch (error) {
      console.error('Error generating text:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Generate Insights
        </Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <TextField
            fullWidth
            label="Enter your prompt"
            variant="outlined"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={generateText}
            sx={{ mb: 2 }}
          >
            Generate
          </Button>
          {response && (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mt: 2 }}>
              {response}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

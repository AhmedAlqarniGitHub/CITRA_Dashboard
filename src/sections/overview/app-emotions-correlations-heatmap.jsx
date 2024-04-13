import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import HeatMap from 'react-heatmap-grid';
import { ChartSelectionsContext } from './chart-selections-context';

const AppEmotionCorrelationHeatmap = ({
  emotionCorrelationHeatmapData,
  events,
  isGeneratingPDF,
}) => {
  const { selections } = useContext(ChartSelectionsContext);
  const [selectedEvent, setSelectedEvent] = useState(events.length > 0 ? events[0] : '');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [oldSelections, setOldSelections] = useState({ event: '', month: '' });

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

  const xLabels = new Array(12).fill(0).map((_, i) => `${i * 2} - ${(i + 1) * 2}`);
  const yLabels = ['Happy', 'Sad', 'Neutral', 'Angry', 'Surprised', 'Disgusted', 'Fearful'];

  useEffect(() => {
    if (isGeneratingPDF) {
      setOldSelections({ event: selectedEvent, month: selectedMonth });
      setSelectedEvent(selections.emotionCorrelationHeatmapEvent || '');
      setSelectedMonth(selections.emotionCorrelationHeatmapMonth || new Date().getMonth() + 1);
    } else {
      setSelectedEvent(oldSelections.event);
      setSelectedMonth(oldSelections.month);
    }
  }, [isGeneratingPDF]);

  useEffect(() => {
    if (isGeneratingPDF) {
      setOldSelections({ event: selectedEvent, month: selectedMonth });
      setSelectedEvent(selections.emotionCorrelationHeatmapEvent || oldSelections.event);
      setSelectedMonth(selections.emotionCorrelationHeatmapMonth || oldSelections.event);
    } else {
      setSelectedEvent(events[0]);
      setSelectedMonth(new Date().getMonth() + 1);
    }
  }, [events]);

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const getHeatMapData = () => {
    if (!selectedEvent || !selectedMonth || !emotionCorrelationHeatmapData[selectedEvent]) {
      return yLabels.map(() => Array(12).fill(0));
    }

    return yLabels.map((label) =>
      emotionCorrelationHeatmapData[selectedEvent][selectedMonth].map(
        (periodData) => periodData[label.toLowerCase()] || 0
      )
    );
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="Emotion Correlation Heatmap" />
      <CardContent style={{ height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FormControl variant="outlined" sx={{ width: '75%' }}>
            <InputLabel>Event</InputLabel>
            <Select value={selectedEvent} onChange={handleEventChange} label="Event">
              {events.map((event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ width: '25%' }}>
            <InputLabel>Month</InputLabel>
            <Select value={selectedMonth} onChange={handleMonthChange} label="Month">
              {months.map((month, index) => (
                <MenuItem key={month} value={index + 1}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <div className="pdf-section">
          <HeatMap
            xLabels={xLabels}
            yLabels={yLabels}
            data={getHeatMapData()}
            xLabelsLocation={'bottom'}
            xLabelWidth={100}
            yLabelWidth={100}
            yLabelTextAlign={'center'}
            cellStyle={(background, value, min, max, data, x, y) => ({
              background: `rgb(20, 115, 150, ${1 - (max - value) / (max - min)})`,
              fontSize: '15px',
            })}
            cellRender={(value) => value && `${value}`}
            height={50}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppEmotionCorrelationHeatmap;

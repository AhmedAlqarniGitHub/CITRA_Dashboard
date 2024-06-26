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
  const { selections, appSelections, updateAppSelections } = useContext(ChartSelectionsContext);
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
    } else if (
      appSelections.emotionCorrelationHeatmapEvent &&
      appSelections.emotionCorrelationHeatmapMonth
    ) {
      setSelectedEvent(appSelections.emotionCorrelationHeatmapEvent || '');
      setSelectedMonth(appSelections.emotionCorrelationHeatmapMonth || new Date().getMonth() + 1);
    } else {
      setSelectedEvent(oldSelections.event);
      setSelectedMonth(oldSelections.month);
    }
  }, [isGeneratingPDF, appSelections]);

  useEffect(() => {
    if (isGeneratingPDF) {
      setOldSelections({ event: selectedEvent, month: selectedMonth });
      setSelectedEvent(selections.emotionCorrelationHeatmapEvent || oldSelections.event);
      setSelectedMonth(selections.emotionCorrelationHeatmapMonth || oldSelections.event);
    } else if (
      appSelections.emotionCorrelationHeatmapEvent &&
      appSelections.emotionCorrelationHeatmapMonth
    ) {
      setSelectedEvent(appSelections.emotionCorrelationHeatmapEvent || '');
      setSelectedMonth(appSelections.emotionCorrelationHeatmapMonth || new Date().getMonth() + 1);
    } else {
      setSelectedEvent(events[0]);
      setSelectedMonth(new Date().getMonth() + 1);
      updateAppSelections({
        emotionCorrelationHeatmapEvent: events[0],
        emotionCorrelationHeatmapMonth: new Date().getMonth() + 1,
      });

    }
  }, [events]);

  const handleEventChange = (e) => {
    // setSelectedEvent(e.target.value);
    updateAppSelections({ emotionCorrelationHeatmapEvent: e.target.value });
  };

  const handleMonthChange = (e) => {
    // setSelectedMonth(e.target.value);
    updateAppSelections({ emotionCorrelationHeatmapMonth: e.target.value });
  };

  const getHeatMapData = () => {
    // Check if data for the selected event and month is available and structured correctly
    if (!selectedEvent || !selectedMonth || 
        !emotionCorrelationHeatmapData[selectedEvent] || 
        !emotionCorrelationHeatmapData[selectedEvent][selectedMonth] ||
        !Array.isArray(emotionCorrelationHeatmapData[selectedEvent][selectedMonth])) {
      // Return an array of zeros if data is missing or not an array
      return yLabels.map(() => Array(xLabels.length).fill(0));
    }
    // Map over the data to create the heatmap data array
    return yLabels.map(label =>
      emotionCorrelationHeatmapData[selectedEvent][selectedMonth].map(
        (periodData) => {
          // Safeguard against periodData not being an object or if label does not exist in periodData
          return (periodData && periodData[label.toLowerCase()]) ? periodData[label.toLowerCase()] : 0;
        }
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

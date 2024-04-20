import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  List,
  ListItem,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { Icon } from '@iconify/react';
import barChartIcon from '@iconify/icons-mdi/chart-bar';
import lineChartIcon from '@iconify/icons-mdi/chart-line';
import heatmapIcon from '@iconify/icons-mdi/thermometer-lines';
import gaugeChartIcon from '@iconify/icons-mdi/gauge';

function SelectionModal({ open, onClose, onSave, events, emotions, months }) {
  const [selections, setSelections] = useState({
    emotionDistributionEvents: events.slice(0, 1),
    eventSatisfactionEvent: events[0] || '',
    emotionsMapEvents: events.slice(0, 1),
    eventEmotionAnalysisEvents: events.slice(0, 1),
    eventEmotionAnalysisEmotions: emotions.slice(0, 1),
    emotionCorrelationHeatmapEvent: events[0] || '',
    emotionCorrelationHeatmapMonth: months[0] || '',
    appWebsiteVisitsEvents: events.slice(0, 1), // Assuming you want to select the first three by default
  });

  useEffect(() => {
    setSelections((prevSelections) => ({
      ...prevSelections,
      emotionDistributionEvents: events.slice(0, 1),
      eventSatisfactionEvent: events[0] || '',
      emotionsMapEvents: events.slice(0, 1),
      eventEmotionAnalysisEvents: events.slice(0, 1),
      eventEmotionAnalysisEmotions: emotions.slice(0, 1),
      emotionCorrelationHeatmapEvent: events[0] || '',
      emotionCorrelationHeatmapMonth: months[0] || '',
      appWebsiteVisitsEvents: events.slice(0, 3),
    }));
  }, [events, emotions, months]);

  const handleSelectionChange = (chart, value) => {
    setSelections({ ...selections, [chart]: value });
  };

  const handleSave = () => {
    onSave(selections);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: '80%',
          maxHeight: '70%',
          overflow: 'auto',
          bgcolor: 'background.paper',
          p: 4,
          position: 'relative',
        }}
      >
        <List>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 2 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img
              src="/assets/logo.svg"
              alt="Logo"
              style={{ width: '70px', marginRight: '10px', marginBlockEnd: '20px' }}
            />
            Chart Selections for Report
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Emotion Distribution per Event */}
          <ListItem>
            <ListItemIcon>
              <Icon icon={barChartIcon} />
            </ListItemIcon>
            <ListItemText primary="Emotion Distribution per Event" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Events</InputLabel>
              <Select
                label={'Events'}
                multiple
                value={selections.emotionDistributionEvents}
                onChange={(e) => handleSelectionChange('emotionDistributionEvents', e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    <Checkbox checked={selections.emotionDistributionEvents.includes(event)} />
                    <ListItemText primary={event} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Event Satisfaction */}
          <ListItem>
            <ListItemIcon>
              <Icon icon={gaugeChartIcon} />
            </ListItemIcon>
            <ListItemText primary="Event Satisfaction" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Event</InputLabel>
              <Select
                label={'Events'}
                value={selections.eventSatisfactionEvent}
                onChange={(e) => handleSelectionChange('eventSatisfactionEvent', e.target.value)}
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Emotions Map */}
          <ListItem>
            <ListItemIcon>
              <Icon icon={heatmapIcon} />
            </ListItemIcon>
            <ListItemText primary="Emotions Map" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Events</InputLabel>
              <Select
                label={'Events'}
                multiple
                value={selections.emotionsMapEvents}
                onChange={(e) => handleSelectionChange('emotionsMapEvents', e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    <Checkbox checked={selections.emotionsMapEvents.includes(event)} />
                    <ListItemText primary={event} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* App Website Visits Data Selection */}
          <ListItem>
            <ListItemIcon>
              {/* Icon for Website Visits (choose as per your UI) */}
              <Icon icon={lineChartIcon} />
            </ListItemIcon>
            <ListItemText primary="Website Visits Data" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Data Series</InputLabel>
              <Select
                label="Data Series"
                multiple
                value={selections.appWebsiteVisitsEvents}
                onChange={(e) => handleSelectionChange('appWebsiteVisitsEvents', e.target.value)}
                renderValue={(selected) => selected.join(', ')}
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    <Checkbox checked={selections.appWebsiteVisitsEvents.includes(event)} />
                    <ListItemText primary={event} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />
          {/* Event Emotion Analysis */}
          <ListItem>
            <ListItemIcon>
              <Icon icon={lineChartIcon} />
            </ListItemIcon>
            <ListItemText primary="Event Emotion Analysis" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Events</InputLabel>
              <Select
                label={'Events'}
                multiple
                value={selections.eventEmotionAnalysisEvents}
                onChange={(e) =>
                  handleSelectionChange('eventEmotionAnalysisEvents', e.target.value)
                }
                renderValue={(selected) => selected.join(', ')}
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    <Checkbox checked={selections.eventEmotionAnalysisEvents.includes(event)} />
                    <ListItemText primary={event} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Emotions</InputLabel>
              <Select
                label={'Emotions'}
                multiple
                value={selections.eventEmotionAnalysisEmotions}
                onChange={(e) =>
                  handleSelectionChange('eventEmotionAnalysisEmotions', e.target.value)
                }
                renderValue={(selected) => selected.join(', ')}
              >
                {emotions.map((emotion) => (
                  <MenuItem key={emotion} value={emotion}>
                    <Checkbox checked={selections.eventEmotionAnalysisEmotions.includes(emotion)} />
                    <ListItemText primary={emotion} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Emotion Correlation Heatmap */}
          <ListItem>
            <ListItemIcon>
              <Icon icon={heatmapIcon} />
            </ListItemIcon>
            <ListItemText primary="Emotion Correlation Heatmap" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Event</InputLabel>
              <Select
                label="Event"
                value={selections.emotionCorrelationHeatmapEvent}
                onChange={(e) =>
                  handleSelectionChange('emotionCorrelationHeatmapEvent', e.target.value)
                }
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                label="Month"
                value={selections.emotionCorrelationHeatmapMonth}
                onChange={(e) =>
                  handleSelectionChange('emotionCorrelationHeatmapMonth', e.target.value)
                }
              >
                {months.map((month, index) => (
                  <MenuItem key={month} value={index + 1}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>

          <Divider sx={{ my: 2 }} />

          {/* Save Button */}
          <ListItem>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
                Generate Report
              </Button>
            </Box>
          </ListItem>
        </List>
      </Box>
    </Modal>
  );
}

export default SelectionModal;

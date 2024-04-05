import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import AppWidgetSummary from '../app-widget-summary';
import AppWebsiteVisits from '../app-website-visits';
import AppCurrentVisits from '../app-current-visits';
import BarChartComponent from '../app-bar-chart';
import AppCurrentSubject from '../app-current-subject';
import InteractiveLineChart from '../app-line-chart';
import AppOrderTimeline from '../app-order-timeline';
import AppSatisfactionGauge from '../app-satisfaction-guage';

import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const chartStyle = {
  height: '580px', // Adjust this value as needed
};

export default function AppView() {
  const [chartData, setChartData] = useState({
    completeEventData: [],
    eventsBarChart: [],
    eventsTimeline: [],
    totalEmotionsPerEvent: [],
    heatmapData: {},
    appWebsiteVisitsData: {},
  });

  const [summaryData, setSummaryData] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalEmotions: 0,
    totalCameras: 0,
  });

  const [events, setEvents] = useState([]); // New state for events

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const eventSummaryResponse = await axios.get(`${apiBaseUrl}/events/summary`);
        const cameraSummaryResponse = await axios.get(`${apiBaseUrl}/cameras/summary`);

        setSummaryData({
          totalEvents: eventSummaryResponse.data.totalEvents,
          activeEvents: eventSummaryResponse.data.activeEvents,
          totalEmotions: eventSummaryResponse.data.totalEmotions,
          totalCameras: cameraSummaryResponse.data.totalCameras,
        });
      } catch (error) {
        console.error('Axios error:', error.message);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/events/charts`);
        setChartData(response.data);

        const fetchedEvents =
          response.data.completeEventData.length > 0
            ? Object.keys(response.data.completeEventData[0]).filter((key) => key !== 'month')
            : [];
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Axios error:', error.message);
      }
    };

    fetchSummaryData();
    fetchChartData();
  }, []);

  const {
    completeEventData,
    eventsBarChart,
    eventsTimeline,
    totalEmotionsPerEvent,
    heatmapData,
    appWebsiteVisitsData,
  } = chartData;

  const emotions =
    eventsBarChart.length > 0
      ? Object.keys(eventsBarChart[0]).filter((key) => key !== 'event').map(e=>e.toLowerCase())
      : [];

  console.log(emotions);

  // Define colors for each emotion
  const emotionColors = {
    happy: '#FFD700', // Gold
    sad: '#1E90FF', // DodgerBlue
    disgusted: '#008000', // Green
    surprised: '#FF69B4', // HotPink
    neutral: '#A52A2A', // Brown
    fearful: '#800080', // Purple
    angry: '#FF0000', // Red
  };

  // Construct series for BarChartComponent
  const series = emotions.map((emotion) => ({
    dataKey: emotion,
    label: emotion,
    fill: emotionColors[emotion] || '#000000', // Default to black if emotion not found
  }));

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        {/* Widgets */}
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Events"
            total={summaryData.totalEvents}
            color="success"
            icon={<img alt="icon" src="/assets/icons/app-view/events_list.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Events"
            total={summaryData.activeEvents}
            color="info"
            icon={<img alt="icon" src="/assets/icons/app-view/active_event.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Emotions Detected"
            total={summaryData.totalEmotions}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/app-view/total_emotions.png" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Number of Cameras"
            total={summaryData.totalCameras}
            color="error"
            icon={<img alt="icon" src="/assets/icons/app-view/cameras.png" />}
          />
        </Grid>
        {/* Charts */}
        {appWebsiteVisitsData.chart && (
          <Grid item xs={12} md={6} lg={8} style={chartStyle}>
            <AppWebsiteVisits
              title="Emotions per Event"
              subheader={appWebsiteVisitsData.subheader}
              chart={appWebsiteVisitsData.chart}
            />
          </Grid>
        )}
        {totalEmotionsPerEvent && (
          <Grid item xs={12} md={6} lg={4} style={chartStyle}>
            <AppCurrentVisits
              title="Emotions Events Percentage"
              chart={{
                series: totalEmotionsPerEvent,
              }}
            />
          </Grid>
        )}
        {eventsBarChart && (
          <Grid item xs={12} md={6} lg={8} style={chartStyle}>
            <BarChartComponent
              title="Emotion Distribution per Event"
              subheader="Aggregated data over the last 12 months"
              dataset={eventsBarChart}
              xAxis={{ dataKey: 'event' }}
              series={series}
              style={{ height: '580px' }}
            />
          </Grid>
        )}

        {eventsTimeline && (
          <Grid item xs={12} md={6} lg={4} style={chartStyle}>
            <AppOrderTimeline
              title="Events Timeline"
              eventsTimeline={eventsTimeline}
              // style={{ height: '580px' }}
            />
          </Grid>
        )}

        <Grid item xs={12} md={6} lg={6} style={chartStyle}>
          <AppSatisfactionGauge title="Event Satisfaction" />
        </Grid>

        {heatmapData && heatmapData.series && (
          <Grid item xs={12} md={6} lg={6} style={chartStyle}>
            <AppCurrentSubject title="Emotions Map" chart={heatmapData} />
          </Grid>
        )}

        {completeEventData.length > 0 && (
          <Grid item xs={12} md={6} lg={12} style={chartStyle}>
            <InteractiveLineChart
              title="Event Emotion Analysis"
              subheader="Monthly emotion distribution per event"
              completeEventData={completeEventData}
              events={events}
              emotions={emotions}
            />
          </Grid>
        )}

        {/* Additional components can be added here */}
      </Grid>
    </Container>
  );
}

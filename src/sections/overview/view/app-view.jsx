import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import BarChartComponent from '../app-bar-chart';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import InteractiveLineChart from '../app-line-chart';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import eventsTimeLine from '../../../_mock/events_timeline';
import eventsBarChart from '../../../_mock/events_barChart';
import completeEventData from '../../../_mock/event_barChart_cont'
import MyLineChart from '../app-test'

const events = ['KFUPM Expo', 'Innovation Expo', 'Riyadh Boulevard', 'Tech Summit'];
const emotions = ['Happy', 'Sad', 'Disgusted', 'Surprised', 'Natural', 'Fear'];


// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Events"
            total={4}
            color="success"
            icon={<img alt="icon" src="/assets/icons/app-view/events_list.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Active Events"
            total={4}
            color="info"
            icon={<img alt="icon" src="/assets/icons/app-view/active_event.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Emotions detected"
            total={10000}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/app-view/total_emotions.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Number of cameras"
            total={8}
            color="error"
            icon={<img alt="icon" src="/assets/icons/app-view/cameras.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Emotions per Event"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2023',
                '02/01/2023',
                '03/01/2023',
                '04/01/2023',
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',
                '08/01/2023',
                '09/01/2023',
                '10/01/2023',
                '11/01/2023',
              ],
              series: [
                {
                  name: 'KFUPM Expo',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Innovation Expo',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Riyadh Boulevard',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
                {
                  name: 'Tech Summit',
                  type: 'line',
                  fill: 'solid',
                  data: [14, 12, 22, 23, 19, 18, 37, 41, 51, 33, 23],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Emotions Events percentage"
            chart={{
              series: [
                { label: 'KFUPM Expo', value: 4344 },
                { label: 'Innovation Expo', value: 5435 },
                { label: 'Riyadh Boulevard', value: 1443 },
                { label: 'Tech Summit', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8} style={{ marginTop: '580px' }}>
          {/* <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          /> */}
          <BarChartComponent
            title="Emotion Distribution per Event"
            subheader="Aggregated data over the last 12 months"
            dataset={eventsBarChart}
            xAxis={{ dataKey: 'event' }}
            series={[
              { dataKey: 'Happy', label: 'Happy', fill: '#8884d8' },
              { dataKey: 'Sad', label: 'Sad', fill: '#82ca9d' },
              { dataKey: 'Disgusted', label: 'Disgusted', fill: '#ffc658' },
              { dataKey: 'Surprised', label: 'Surprised', fill: '#d0ed57' },
              { dataKey: 'Natural', label: 'Natural', fill: '#a4de6c' },
              { dataKey: 'Fear', label: 'Fear', fill: '#d88884' },
            ]}
            

          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Emotions Map"
            chart={{
              categories: ['Happy', 'Sad', 'Disgusted', 'Surprised', 'Natural', 'Fear'],
              series: [
                { name: 'KFUPM Expo', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Innovation Expo', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Riyadh Boulevard', data: [44, 76, 78, 13, 43, 10] },
                { name: 'Tech Summit', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          {/* <BarChartComponent
  title="Emotion Distribution per Event"
  subheader="Aggregated data over the last 12 months"
  dataset={eventsBarChart}
  xAxis={{ dataKey: 'event' }}
  series={[
    { dataKey: 'Happy', label: 'Happy', fill: '#8884d8' },
    { dataKey: 'Sad', label: 'Sad', fill: '#82ca9d' },
    { dataKey: 'Disgusted', label: 'Disgusted', fill: '#ffc658' },
    { dataKey: 'Surprised', label: 'Surprised', fill: '#d0ed57' },
    { dataKey: 'Natural', label: 'Natural', fill: '#a4de6c' },
    { dataKey: 'Fear', label: 'Fear', fill: '#d88884' },
  ]}
/> */}

    <InteractiveLineChart
      title="Event Emotion Analysis"
      subheader="Monthly emotion distribution per event"
      completeEventData={completeEventData}
      events={events}
      emotions={emotions}
    />




        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Events Timeline"
            eventsTimeline={eventsTimeLine}
            style={{ height: '580px' }}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'KFUPM Expo',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Riyadh boulevard',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}

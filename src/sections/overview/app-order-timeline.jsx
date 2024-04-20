import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'; // Import timelineItemClasses
import { fDateTime } from 'src/utils/format-time'; // Ensure the path to this utility function is correct

// Styling for the card with modern scrollbar
const cardStyle = {
  height: '100%', // Adjust height as needed
  overflow: 'auto', // Ensure content is scrollable
  '&::-webkit-scrollbar': {
    width: '0.4em'
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.2)',
    outline: '1px solid slategrey',
    borderRadius: '10px' // Rounded corners for the scrollbar thumb
  }
};

function OrderItem({ item, lastTimeline }) {
  const { title, status, time } = item;
  const type = status === 'Started' ? 'success' : 'error';

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot color={type} />
        {!lastTimeline && <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDateTime(time)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object.isRequired,
  lastTimeline: PropTypes.bool,
};

export default function AppOrderTimeline({ title, subheader, eventsTimeline, ...other }) {
  return (
    <Card sx={cardStyle} {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Timeline
        sx={{
          m: 0,
          p: 3,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {eventsTimeline.map((item, index) => (
          <OrderItem key={item.id} item={item} lastTimeline={index === eventsTimeline.length - 1} />
        ))}
      </Timeline>
    </Card>
  );
}

AppOrderTimeline.propTypes = {
  eventsTimeline: PropTypes.array.isRequired,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

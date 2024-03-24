// AppOrderTimeline.js

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


const cardStyle = {
  height: 'auto', // This can be a specific value or 'auto' for natural height
  overflow: 'auto' // Add a scrollbar if content overflows
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
    <Card style={cardStyle} {...other}>
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

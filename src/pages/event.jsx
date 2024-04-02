import { Helmet } from 'react-helmet-async';

import { EventView } from 'src/sections/event/view'; // Make sure your import path matches your project structure

// ----------------------------------------------------------------------

export default function EventPage() {
  return (
    <>
      <Helmet>
        <title>Event | CITRA Dashboard</title> {/* Update the title to reflect the event page */}
      </Helmet>

      <EventView /> {/* This should be your main event view component */}
    </>
  );
}

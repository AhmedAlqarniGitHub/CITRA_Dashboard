import { Helmet } from 'react-helmet-async';

import { AppView } from 'src/sections/overview/view';
import { ChartSelectionsProvider } from 'src/sections/overview/chart-selections-context'
// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> CITRA Dashboard</title>
      </Helmet>

      <ChartSelectionsProvider>
        <AppView />
      </ChartSelectionsProvider>
    </>
  );
}

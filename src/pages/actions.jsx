import { Helmet } from 'react-helmet-async';

import { ActionsView } from 'src/sections/actions';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Insightful Action | CITRA Dashboard </title>
      </Helmet>

      <ActionsView />
    </>
  );
}

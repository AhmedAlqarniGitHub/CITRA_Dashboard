import { Helmet } from 'react-helmet-async';

import { UserView } from 'src/sections/user_event/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | CITRA Dashboard </title>
      </Helmet>

      <UserView />
    </>
  );
}

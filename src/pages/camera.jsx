import { Helmet } from 'react-helmet-async';

import { CameraView } from 'src/sections/camera/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User | CITRA Dashboard </title>
      </Helmet>

      <CameraView />
    </>
  );
}

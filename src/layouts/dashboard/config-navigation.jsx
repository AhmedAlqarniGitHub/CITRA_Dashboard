import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);


const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
];

  localStorage.getItem('role') == 'admin'
    ? navConfig.push({
        title: 'users',
        path: '/user',
        icon: icon('ic_user'),
      })
    : null;

  navConfig.push(
    {
      title: 'events',
      path: '/event',
      icon: icon('ic_event'),
    },
    {
      title: 'cameras',
      path: '/camera',
      icon: icon('ic_camera'),
    },
    {
      title: 'Insightful Actions',
      path: '/actions',
      icon: icon('ic_actions'),
    },

  );

export default navConfig;

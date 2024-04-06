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
        title: 'user',
        path: '/user',
        icon: icon('ic_user'),
      })
    : null;

  navConfig.push(
    {
      title: 'event',
      path: '/event',
      icon: icon('ic_event'),
    },
    {
      title: 'camera',
      path: '/camera',
      icon: icon('ic_event'),
    },
  );

export default navConfig;

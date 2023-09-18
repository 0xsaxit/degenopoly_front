/* eslint-disable */
import homeFill from '@iconify/icons-eva/home-fill';
import roundGrain from '@iconify/icons-ic/round-grain';
import { Icon } from '@iconify/react';
// routes

// ----------------------------------------------------------------------

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Main Site',
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
    path: '/'
  },
  {
    title: 'Whitepaper',
    icon: <Icon icon={roundGrain} {...ICON_SIZE} />,
    path: '/static/whitepaper.pdf'
  }
];

export default menuConfig;

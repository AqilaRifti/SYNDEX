import { NavItem } from '@/types';

/**
 * SYNDEX Navigation Configuration
 * Consistent navigation structure for the dashboard
 */
export const navItems: NavItem[] = [
  {
    title: 'SYNDEX',
    url: '/dashboard/syndex',
    icon: 'syndex',
    isActive: true,
    shortcut: ['s', 's'],
    items: [
      {
        title: 'Dashboard',
        url: '/dashboard/syndex',
        icon: 'dashboard',
        shortcut: ['d', 'd']
      },
      {
        title: 'New Deal',
        url: '/dashboard/syndex/deals/new',
        icon: 'add',
        shortcut: ['n', 'd']
      },
      {
        title: 'Banks Directory',
        url: '/dashboard/syndex/banks',
        icon: 'banks',
        shortcut: ['b', 'd']
      }
    ]
  },
  {
    title: 'Account',
    url: '#',
    icon: 'account',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'profile',
        shortcut: ['m', 'm']
      },
      {
        title: 'Sign Out',
        shortcut: ['s', 'o'],
        url: '/auth/sign-out',
        icon: 'login'
      }
    ]
  }
];

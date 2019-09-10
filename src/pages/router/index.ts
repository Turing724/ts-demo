// import Header from '../Components/Header';

export const routes: RoutesItem[] = [
  {
    path: '/Header',
    component: () => import('../Components/Header'),
    exact: true,
    strict: false,
    name: '首页'
  }
];

export interface RoutesItem {
  path: String;
  component: () => Promise<any>;
  exact: boolean;
  name?: string;
  strict: boolean;
}

/* eslint-disable */
import Home from '../view/Home';

export interface RoutesItem {
  path: string;
  component: any;
  exact: boolean;
  // name?: string;
  strict: boolean;
}

export const routes: RoutesItem[] = [
  {
    path: '/',
    component: Home,
    exact: true,
    strict: false
  }
];

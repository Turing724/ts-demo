/* eslint-disable */
import { observable, action } from 'mobx';
import { LoginMobxStore } from './LoginMobx.interface';

class Store implements LoginMobxStore {
  @observable currentIndex: number = 0;
  @action changeTab(index: number): void {
    this.currentIndex = index;
  }
}

export default new Store();

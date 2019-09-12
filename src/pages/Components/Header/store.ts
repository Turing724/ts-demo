import { observable, action } from 'mobx';
import { LoginMobxStore } from './LoginMobx.interface';

class Store implements LoginMobxStore {
  @observable public currentIndex: number = 0;
  @action public changeTab(index: number): void {
    this.currentIndex = index;
  }
}

export default new Store();

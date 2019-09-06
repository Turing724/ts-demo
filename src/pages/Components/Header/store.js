import { observable, action } from 'mobx';

class Store {
  @observable currentIndex = 0;
  @action changeTab(index) {
    this.currentIndex = index;
  }
}

export default new Store();

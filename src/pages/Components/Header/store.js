import { observable, action } from 'mobx';

class Store {
  @observable counter = 0;
  @action doAdd = () => {
    this.counter++;
  };
  @action do = () => {
    this.counter--;
  };
}

export default new Store();

import { observable, action } from 'mobx';
import { HomeMobxStore } from './HomeMobx.interface';
import axios from 'axios';
class Store implements HomeMobxStore {
  @observable bannerList: [];

  @action getBannerList(): void {
    axios.get('/mock/Banner.json').then(res => {
      this.bannerList = res.data;
    });
  }
}

export default new Store()

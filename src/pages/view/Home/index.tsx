import * as React from 'react';
import { observer } from 'mobx-react';
// import { toJS } from 'mobx';
import { LoginProps, LoginState } from './Home.interface';
// import { Carousel } from 'antd';
import Store from './store';
import './index.less';
import swiper from 'swiper';
import 'swiper/css/swiper.min.css';
@observer
class Home extends React.PureComponent<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      swiperID: '1'
    };
  }
  render() {
    return (
      <div id="Home">
        <div className="bannerList">
          {/* <Carousel autoplay>
            {Store.bannerList &&
              toJS(Store.bannerList).map(x => {
                return (
                  <div key={x['id']}>
                    <img src={x['url']} alt="" className="img-item" />
                  </div>
                );
              })}
          </Carousel> */}
          <div id={this.state.swiperID}>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide">Slide 1</div>
                <div className="swiper-slide">Slide 2</div>
                <div className="swiper-slide">Slide 3</div>
              </div>
              <div className="swiper-pagination"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  componentDidMount() {
    Store.getBannerList();
    new swiper(`#${this.state.swiperID} .swiper-container`, {
      autoplay: true,
      loop: true,
      pagination: {
        el: `#${this.state.swiperID} ..swiper-pagination`
      }
    });
  }
}
export default Home;

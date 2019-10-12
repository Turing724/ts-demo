import * as React from 'react'
import { observer } from 'mobx-react'
// import { toJS } from 'mobx';
import { LoginProps, LoginState } from './Home.interface'
// import { Carousel } from 'antd';
import Store from './store'
import './index.less'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
@observer
class Home extends React.PureComponent<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props)
    this.state = {
      mySwiper: null
    }
  }
  componentDidMount() {
    Store.getBannerList()
    
    this.setState({
      mySwiper: new Swiper(`.swiper-container`, {
        autoplay: true,
        loop: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loopedSlides: 3,
        spaceBetween: 0,
        pagination: {
          el: `.swiper-pagination`
        }
      })
    })
  }

  handlePrev = () => {
    this.state.mySwiper.slidePrev()
    console.log(13)
  }
  
  render() {
    return (
      <div id="Home">
        <div className="bannerList">
          <div>
            <div className="hoverPrev hoverBtn"></div>
            <div className="hoverNext hoverBtn"></div>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/190518/7CEekErj7.webp-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/190910/snKfRIyXi.png-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/191010/dNdNVLFnZ.webp-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/191010/dNdNVLFnZ.webp-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/191010/ThgXnKaDi.webp-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/190827/muphAvSQK.png-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/190905/pYaYAtrCp.png-fe.w1080.webp.m.i1" alt=""/>
                </div>
                <div className="swiper-slide">
                  <img src="http://f2.kkmh.com/image/190905/pYaYAtrCp.png-fe.w1080.webp.m.i1" alt=""/>
                </div>
              </div>
              {/* <div className="swiper-pagination"></div> */}
              <div className="swiper-button-prev" onClick={this.handlePrev} />
              <div className="swiper-button-next" />
            </div>
          </div>
        </div>
      </div>
    )
  }
 
  
}
export default Home

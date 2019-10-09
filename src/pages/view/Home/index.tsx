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
            <div className="swiper-container">
              <div className="swiper-wrapper">
                <div className="swiper-slide">Slide 1</div>
                <div className="swiper-slide">Slide 2</div>
                <div className="swiper-slide">Slide 3</div>
              </div>
              <div className="swiper-pagination"></div>
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

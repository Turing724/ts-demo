import * as React from 'react';
import { observer } from 'mobx-react';
import { LoginProps, LoginState } from './Home.interface';
import { Carousel } from 'antd';
@observer
class Home extends React.PureComponent<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      bannerList: []
    };
  }
  render() {
    return (
      <div id="Banner">
        <Carousel autoplay>
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
        </Carousel>
      </div>
    );
  }
}

export default Home;

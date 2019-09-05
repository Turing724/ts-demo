import React from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route } from 'react-router-dom';
import './assets/style/reset.less';
import 'antd/dist/antd.css';
import Header from './pages/Components/Header';
import { routes } from './pages/router';
import * as store from './store';
function App() {
  return (
    <div className="App">
      <Provider {...store}>
        <BrowserRouter>
          <div>
            <Header />
            {routes.map(({ path, component, exact }) => {
              return <Route path={path} exact={exact} component={component} key={path} />;
            })}
          </div>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

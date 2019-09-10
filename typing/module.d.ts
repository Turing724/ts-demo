declare module '*.less' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module 'reactRouterDom' {
  export { Link, BrowserRouter, Route, Router } from 'react-router-dom';
}

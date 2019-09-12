declare module '*.less' {
  const content: any;
  export default content;
}

declare module 'reactRouterDom' {
  export { Link, BrowserRouter, Route, Router } from 'react-router-dom';
}

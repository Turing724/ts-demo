const proxy = require('http-proxy-middleware');
module.exports = app => {
  app.use(
    proxy('/v2', {
      target: 'https://www.kuaikanmanhua.com/',
      changeOrigin: true
    })
  );
};

const { App } = require('./app');
const {
  readBody,
  serveStaticPage,
  pageNotFound,
  methodNotAllowed
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.use(methodNotAllowed);

module.exports = { app };

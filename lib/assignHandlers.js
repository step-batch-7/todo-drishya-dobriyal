const { App } = require('./app');
const {
  readBody,
  serveStaticPage,
  pageNotFound,
  serveSaveTodo,
  methodNotAllowed
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTodo', serveSaveTodo)
app.use(methodNotAllowed);

module.exports = { app };

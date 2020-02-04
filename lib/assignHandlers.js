const { App } = require('./app');
const {
  readBody,
  todoData,
  serveStaticPage,
  pageNotFound,
  serveSaveTodo,
  methodNotAllowed
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('/todoList.json', todoData);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTodo', serveSaveTodo)
app.use(methodNotAllowed);

module.exports = { app };

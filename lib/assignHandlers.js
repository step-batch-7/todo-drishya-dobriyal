const { App } = require('./app');
const {
  readBody,
  todoData,
  serveStaticPage,
  pageNotFound,
  serveSaveTitle,
  serveEditedTodo,
  methodNotAllowed
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('/todoList.json', todoData);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTitle', serveSaveTitle)
app.post('/saveEditedTodo', serveEditedTodo)
app.use(methodNotAllowed);

module.exports = { app };

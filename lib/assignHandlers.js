const { App } = require('./app');
const {
  readBody,
  todoData,
  serveStaticPage,
  pageNotFound,
  serveSaveTitle,
  serveDeleteItem,
  serveToggleStatus,
  methodNotAllowed,
  serveSaveItem,
  serveDeleteTitle
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('/todoList.json', todoData);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTitle', serveSaveTitle);
app.post('/saveItem', serveSaveItem);
app.post('/toggleStatus', serveToggleStatus);
app.post('/deleteItem', serveDeleteItem);
app.post('/deleteTitle', serveDeleteTitle);
app.use(methodNotAllowed);

module.exports = { app };

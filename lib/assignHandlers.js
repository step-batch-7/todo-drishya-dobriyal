const { App } = require('./app');
const {
  readBody,
  todoData,
  serveStaticPage,
  pageNotFound,
  serveSaveTitle,
  serveDeleteItem,
  methodNotAllowed,
  serveSaveItem
} = require('./handlers');

const app = new App();

app.use(readBody);
app.get('/todoList.json', todoData);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTitle', serveSaveTitle);
app.post('/saveItem', serveSaveItem);
app.post('/deleteItem', serveDeleteItem);
app.use(methodNotAllowed);

module.exports = { app };

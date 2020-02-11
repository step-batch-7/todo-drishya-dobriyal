const { App } = require('./app');
const {
  readBody,
  todoData,
  serveStaticPage,
  pageNotFound,
  serveSaveTitle,
  serveDeleteItem,
  serveToggleStatus,
  serveChangeTitle,
  methodNotAllowed,
  serveSaveItem,
  serveChangeItem,
  serveMatch,
  serveDeleteTitle,
  signUp,
  parseBody
} = require('./handlers');

const app = new App();

app.use(readBody);
app.use(parseBody);
app.get('/todoList.json', todoData);
app.get('', serveStaticPage);
app.get('', pageNotFound);
app.post('/saveTitle', serveSaveTitle);
app.post('/saveItem', serveSaveItem);
app.post('/toggleStatus', serveToggleStatus);
app.post('/deleteItem', serveDeleteItem);
app.post('/deleteTitle', serveDeleteTitle);
app.post('/changeTitle', serveChangeTitle);
app.post('/changeItem', serveChangeItem);
app.post('/findGivenContent', serveMatch);
app.post('/signUp', signUp);
app.use(methodNotAllowed);

module.exports = { app };

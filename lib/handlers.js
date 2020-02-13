const fs = require('fs');
const querystring = require('querystring')

const CONTENT_TYPE = require('./mimeTypes');
const { DATA_STORE, USER_CREDENTIALS } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const { TodoStore } = require('./todoStore');
const { UserFolder } = require('./userFolder');
const { SessionManager } = require('./sessionManager')

const userFolder = UserFolder.loadUsers(USER_CREDENTIALS);
const sessions = new SessionManager();
// const todoStore = new TodoStore(DATA_STORE);
// todoStore.load();

const readBody = (req, response, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const parseBody = (request, response, next) => {
  if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
    request.body = querystring.parse(request.body);
    next();
    return;
  }
  if (request.body) {
    request.body = JSON.parse(request.body);
  }
  next();
};

const todoData = (request, response, next) => {
  const content = JSON.stringify(todoStore.list);
  response.setHeader('content-type', CONTENT_TYPE.json);
  response.write(content);
  response.end();
};

const isFileNotPresent = path => {
  const stat = fs.existsSync(path) && fs.statSync(path);
  return !stat || !stat.isFile();
};

const serveStaticPage = (request, response, next) => {
  if (request.url === '/') {
    request.url = '/../templates/index.html';
  }
  const path = `${STATIC_FOLDER}${request.url}`;
  if (isFileNotPresent(path)) {
    return next();
  }
  const content = fs.readFileSync(path);
  const [, extension] = path.match(/.*\.(.*)/);
  response.setHeader('content-type', CONTENT_TYPE[extension]);
  response.write(content);
  response.end();
};

const pageNotFound = function (request, response) {
  const errorCode = 404;
  response.writeHead(errorCode);
  response.end('Not Found');
};

const methodNotAllowed = function (req, res) {
  const status = 400;
  res.writeHead(status, 'Method Not Allowed');
  res.end();
};

const getId = () => new Date().getTime();

const serveSaveTitle = function (request, response, next) {
  const { title } = request.body;
  if (!isDataValid([title])) return next();
  const id = `T_${getId()}`;
  const newTodoDetail = todoStore.addTitle(title, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newTodoDetail));
};

const serveSaveItem = function (request, response, next) {
  const { task, id } = request.body;
  if (!isDataValid([task, id])) return next();
  task.id = `i_${getId()}`;
  const newItem = todoStore.addItem(task, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newItem));
};

const isDataValid = function (data) {
  return data.every(data => data);
};

const serveDeleteItem = function (request, response, next) {
  const { titleId, itemId } = request.body;
  if (!isDataValid([titleId, itemId])) return next();
  todoStore.deleteItem(titleId, itemId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveToggleStatus = (request, response, next) => {
  const { titleId, itemId } = request.body;
  if (!isDataValid([titleId, itemId])) return next();
  todoStore.toggleStatus(titleId, itemId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveDeleteTitle = (request, response, next) => {
  const { id } = request.body;
  if (!isDataValid([id])) return next();
  todoStore.deleteTodo(id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ id }));
};

const serveChangeTitle = (request, response, next) => {
  const { newTitle, id } = request.body;
  if (!isDataValid([newTitle, id])) return next();
  todoStore.changeTitle(newTitle, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveChangeItem = (request, response, next) => {
  const { newItem, itemId, titleId } = request.body;
  if (!isDataValid([newItem, itemId, titleId])) return next();
  todoStore.changeTask(newItem, itemId, titleId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const signUp = function (request, response, next) {
  const { username, password } = request.body;
  if (!isDataValid([username, password])) return next();
  if (!userFolder.userExists(username)) {
    const todoPath = `${username}.json`;
    userFolder.addUser({ username, password, path: todoPath });
  }
  response.writeHead(303, {
    'location': '/login.html'
  });
  response.end();
};


const serveMatch = (request, response, next) => {
  const { content, search } = request.body;
  if (!isDataValid([search])) return next();
  const matchedList = todoStore.match(search, content);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(matchedList));
};

module.exports = {
  readBody,
  parseBody,
  todoData,
  serveDeleteItem,
  serveStaticPage,
  serveSaveTitle,
  serveMatch,
  serveDeleteTitle,
  serveChangeTitle,
  serveChangeItem,
  serveSaveItem,
  pageNotFound,
  methodNotAllowed,
  serveToggleStatus,
  signUp
};

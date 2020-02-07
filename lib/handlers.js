const fs = require('fs');

const { TodoList } = require('./todo');
const STATIC_FOLDER = `${__dirname}/../public`;
const { DATA_STORE } = require('../config');

const CONTENT_TYPE = require('./mimeTypes');

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

const todoData = (request, response, next) => {
  const content = fs.readFileSync(DATA_STORE, 'utf8');
  response.setHeader('content-type', CONTENT_TYPE.json);
  response.write(content);
  response.end();
}

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
  let currentTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  request.body = JSON.parse(request.body);
  const { title } = request.body;
  const id = `T_${getId()}`;
  const todoList = TodoList.load(currentTodo.userName);
  todoList.addTitle(title, id);
  currentTodo.userName = todoList.getTodoList();
  fs.writeFileSync(DATA_STORE, JSON.stringify(currentTodo));
  response.end();
  next();
};

const serveSaveItem = function (request, response, next) {
  let currentTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { task, id } = JSON.parse(request.body);
  const todoList = TodoList.load(currentTodo.userName);
  task.id = `i_${getId()}`;
  todoList.addItem(task, id);
  currentTodo.userName = todoList.getTodoList();
  fs.writeFileSync(DATA_STORE, JSON.stringify(currentTodo));
  response.end();
  next();
};

const serveDeleteItem = function (request, response, next) {
  let currentTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { titleId, itemId } = JSON.parse(request.body);
  const todoList = TodoList.load(currentTodo.userName);
  todoList.deleteItem(titleId, itemId);
  currentTodo.userName = todoList.getTodoList();
  fs.writeFileSync(DATA_STORE, JSON.stringify(currentTodo));
  response.end();
  next();
};

const serveToggleStatus = (request, response, next) => {
  let currentTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { newStatus, titleId, itemId } = JSON.parse(request.body);
  const todoList = TodoList.load(currentTodo.userName);
  todoList.toggleStatus(titleId, itemId, newStatus);
  currentTodo.userName = todoList.getTodoList();
  fs.writeFileSync(DATA_STORE, JSON.stringify(currentTodo));
  response.end();
  next();
};

module.exports = {
  readBody,
  todoData,
  serveDeleteItem,
  serveStaticPage,
  serveSaveTitle,
  serveSaveItem,
  pageNotFound,
  methodNotAllowed,
  serveToggleStatus
};

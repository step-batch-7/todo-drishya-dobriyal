const fs = require('fs');

const CONTENT_TYPE = require('./mimeTypes');
const { DATA_STORE } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const { DataFolder } = require('./dataFolder');
const { TodoList } = require('./todo');

const dataFolder = new DataFolder(DATA_STORE);
dataFolder.load();

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
  const content = JSON.stringify(dataFolder.list);
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

const pageNotFound = function(request, response) {
  const errorCode = 404;
  response.writeHead(errorCode);
  response.end('Not Found');
};

const methodNotAllowed = function(req, res) {
  const status = 400;
  res.writeHead(status, 'Method Not Allowed');
  res.end();
};

const getId = () => new Date().getTime();

const serveSaveTitle = function(request, response, next) {
  request.body = JSON.parse(request.body);
  const { title } = request.body;
  const id = `T_${getId()}`;
  const todoList = TodoList.load(dataFolder.list);
  const newTodoDetail = todoList.addTitle(title, id);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newTodoDetail));
};

const serveSaveItem = function(request, response, next) {
  const { task, id } = JSON.parse(request.body);
  task.id = `i_${getId()}`;
  const todoList = TodoList.load(dataFolder.list);
  const newItem = todoList.addItem(task, id);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newItem));
};

const serveDeleteItem = function(request, response, next) {
  const { titleId, itemId } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  todoList.deleteItem(titleId, itemId);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveToggleStatus = (request, response, next) => {
  const { newStatus, titleId, itemId } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  todoList.toggleStatus(titleId, itemId, newStatus);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveDeleteTitle = (request, response, next) => {
  const { id } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  todoList.deleteTodo(id);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ id }));
};

const serveChangeTitle = (request, response, next) => {
  const { newTitle, id } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  todoList.changeTitle(newTitle, id);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};
const serveChangeItem = (request, response, next) => {
  const { newItem, itemId, titleId } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  todoList.changeItem(newItem, itemId, titleId);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveMatch = (request, response, next) => {
  const { content, search } = JSON.parse(request.body);
  const todoList = TodoList.load(dataFolder.list);
  const matchedList = todoList.match(search, content);
  dataFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(matchedList));
};

module.exports = {
  readBody,
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
  serveToggleStatus
};

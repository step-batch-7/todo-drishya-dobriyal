const fs = require('fs');

const CONTENT_TYPE = require('./mimeTypes');
const { DATA_STORE, USER_CREDENTIALS } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const { DataFolder } = require('./dataFolder');
const { TodoList } = require('./todo');

const todoFolder = new DataFolder(DATA_STORE);
todoFolder.load();
const userFolder = new DataFolder(USER_CREDENTIALS);
userFolder.load();

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
  if (request.body) {
    request.body = JSON.parse(request.body);
  }
  next();
};

const todoData = (request, response, next) => {
  const content = JSON.stringify(todoFolder.list);
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
  const { title } = request.body;
  if (!isDataValid([title])) return next();
  const id = `T_${getId()}`;
  const todoList = TodoList.load(todoFolder.list);
  const newTodoDetail = todoList.addTitle(title, id);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newTodoDetail));
};

const serveSaveItem = function(request, response, next) {
  const { task, id } = request.body;
  if (!isDataValid([task, id])) return next();
  task.id = `i_${getId()}`;
  const todoList = TodoList.load(todoFolder.list);
  const newItem = todoList.addItem(task, id);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newItem));
};

const isDataValid = function(data) {
  return data.every(data => data);
};

const serveDeleteItem = function(request, response, next) {
  const { titleId, itemId } = request.body;
  if (!isDataValid([titleId, itemId])) return next();
  const todoList = TodoList.load(todoFolder.list);
  todoList.deleteItem(titleId, itemId);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveToggleStatus = (request, response, next) => {
  const { titleId, itemId } = request.body;
  if (!isDataValid([titleId, itemId])) return next();
  const todoList = TodoList.load(todoFolder.list);
  todoList.toggleStatus(titleId, itemId);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveDeleteTitle = (request, response, next) => {
  const { id } = request.body;
  if (!isDataValid([id])) return next();
  const todoList = TodoList.load(todoFolder.list);
  todoList.deleteTodo(id);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ id }));
};

const serveChangeTitle = (request, response, next) => {
  const { newTitle, id } = request.body;
  if (!isDataValid([newTitle, id])) return next();
  const todoList = TodoList.load(todoFolder.list);
  todoList.changeTitle(newTitle, id);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveChangeItem = (request, response, next) => {
  const { newItem, itemId, titleId } = request.body;
  if (!isDataValid([newItem, itemId, titleId])) return next();
  const todoList = TodoList.load(todoFolder.list);
  todoList.changeTask(newItem, itemId, titleId);
  todoFolder.saveData(todoList.getTodoDetails());
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const userExists = function(list, username) {
  return list.some(userData => userData.username === username);
};

const signUp = function(request, response, next) {
  const { username, password } = request.body;
  if (!isDataValid([username, password])) return next();
  if (userExists) {
    res.end(JSON.stringify({ error: 'user Exists' }));
    return;
  }
  const usersDetails = userFolder.data;
  usersDetails.push({ username, password });
  userFolder.saveData(usersDetails);
  response.end(JSON.stringify({}));
};

const serveMatch = (request, response, next) => {
  const { content, search } = request.body;
  if (!isDataValid([search])) return next();
  const todoList = TodoList.load(todoFolder.list);
  const matchedList = todoList.match(search, content);
  todoFolder.saveData(todoList.getTodoDetails());
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

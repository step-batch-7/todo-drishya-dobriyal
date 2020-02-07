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
  const previousTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { task, id } = JSON.parse(request.body);
  const todo = previousTodo.userName.find(data => {
    return data.id === id;
  });
  const { item, statusCode } = task;
  const indexOfTitle = previousTodo.userName.indexOf(todo);
  previousTodo.userName[indexOfTitle].tasks.push({ item, id: `i_${getId()}`, statusCode });
  fs.writeFileSync(DATA_STORE, JSON.stringify(previousTodo));
  response.end();
  next();
};

const serveDeleteItem = function (request, response, next) {
  const previousTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { titleId, itemId } = JSON.parse(request.body);

  const titleObj = previousTodo.userName.find(obj => {
    return obj.id === titleId;
  });
  const indexOfTitle = previousTodo.userName.indexOf(titleObj);

  const itemObj = previousTodo.userName[indexOfTitle].tasks.find(obj => {
    return obj.id === itemId;
  });
  const indexOfItem = previousTodo.userName[indexOfTitle].tasks.indexOf(itemObj);

  previousTodo.userName[indexOfTitle].tasks.splice(indexOfItem, 1);
  fs.writeFileSync(DATA_STORE, JSON.stringify(previousTodo));
  response.end();
  next();
};

const serveToggleStatus = (request, response, next) => {
  const previousTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  const { newStatus, titleId, itemId } = JSON.parse(request.body);

  const titleObj = previousTodo.userName.find(obj => {
    return obj.id === titleId;
  });
  const indexOfTitle = previousTodo.userName.indexOf(titleObj);

  const itemObj = previousTodo.userName[indexOfTitle].tasks.find(obj => {
    return obj.id === itemId;
  });
  const indexOfItem = previousTodo.userName[indexOfTitle].tasks.indexOf(itemObj);
  previousTodo.userName[indexOfTitle].tasks[indexOfItem].statusCode = newStatus;
  fs.writeFileSync(DATA_STORE, JSON.stringify(previousTodo));
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

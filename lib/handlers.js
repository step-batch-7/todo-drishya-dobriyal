const queryString = require('querystring');
const fs = require('fs');

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

const serveSaveTodo = function (request, response, next) {
  const currentTodo = JSON.parse(fs.readFileSync(DATA_STORE, 'utf8'));
  request.body = queryString.parse(request.body);
  let { title, todoItems } = request.body;
  todoItems = todoItems.split('\r\n');
  const taskStatus = "undone";
  todoItems = todoItems.map((item, id) => {
    return { item, id, taskStatus }
  });
  currentTodo.unshift({ title, todoItems });
  fs.writeFileSync(DATA_STORE, JSON.stringify(currentTodo));
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

module.exports = {
  readBody,
  todoData,
  serveStaticPage,
  serveSaveTodo,
  pageNotFound,
  methodNotAllowed
};

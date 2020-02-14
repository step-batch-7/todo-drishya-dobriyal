const CONTENT_TYPE = require('./mimeTypes');
const { DATA_STORE, USER_CREDENTIALS } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const { TodoStore } = require('./todoStore');
const { UserFolder } = require('./userFolder');
const { SessionManager } = require('./sessionManager')

// const userFolder = UserFolder.loadUsers(USER_CREDENTIALS);
const sessions = new SessionManager();
const todoStore = new TodoStore(DATA_STORE);
todoStore.load();

const todoData = (request, response, next) => {
  const content = JSON.stringify(todoStore.list);
  response.setHeader('content-type', CONTENT_TYPE.json);
  response.write(content);
  response.end();
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

const login = function (request, response, next) {
  const { username, password } = request.body;
  if (!isDataValid([username, password])) return next();
  if (!userFolder.userExists) {
    response.writeHead(303, {
      'location': '/signup.html'
    });
    response.end();
  }

  if (userFolder.isValidUser(username, password)) {
    const sessionId = `${username}_${new Date().getTime()}`
    const todoStore =
      sessions.createSession(sessionId)
  }

}

const serveMatch = (request, response, next) => {
  const { content, search } = request.body;
  if (!isDataValid([search])) return next();
  const matchedList = todoStore.match(search, content);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(matchedList));
};

module.exports = {
  todoData,
  serveDeleteItem,
  serveSaveTitle,
  serveMatch,
  serveDeleteTitle,
  serveChangeTitle,
  serveChangeItem,
  serveSaveItem,
  serveToggleStatus,
  signUp
};

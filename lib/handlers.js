const CONTENT_TYPE = require('./mimeTypes');
const { DATA_STORE, USER_CREDENTIALS } = require('../config');
const STATIC_FOLDER = `${__dirname}/../public`;

const { TodoStore } = require('./todoStore');
const { UserFolder } = require('./userFolder');
const { sessions } = require('./sessionManager')

const userFolder = UserFolder.loadUsers(USER_CREDENTIALS);
const todoStore = new TodoStore(DATA_STORE);
todoStore.load();

const todoData = (request, response, next) => {
  const username = request.username;
  const content = JSON.stringify(todoStore.getList(username))
  response.setHeader('content-type', CONTENT_TYPE.json);
  response.write(content);
  response.end();
};

const getId = () => new Date().getTime();

const serveSaveTitle = function (request, response, next) {
  const { title } = request.body;
  const username = request.username
  if (!isDataValid([title])) return badRequest(response);
  const id = `T_${getId()}`;
  const newTodoDetail = todoStore.addTitle(username, title, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newTodoDetail));
};

const serveSaveItem = function (request, response, next) {
  const { task, id } = request.body;
  const username = request.username
  if (!isDataValid([task, id])) return badRequest(response);
  task.id = `i_${getId()}`;
  const newItem = todoStore.addItem(username, task, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(newItem));
};

const isDataValid = function (data) {
  return data.every(data => data);
};

const serveDeleteItem = function (request, response, next) {
  const { titleId, itemId } = request.body;
  const username = request.username
  if (!isDataValid([titleId, itemId])) return badRequest(response);
  todoStore.deleteItem(username, titleId, itemId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveToggleStatus = (request, response, next) => {
  const { titleId, itemId } = request.body;
  const username = request.username
  if (!isDataValid([titleId, itemId])) return badRequest(response);
  todoStore.toggleStatus(username, titleId, itemId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveDeleteTitle = (request, response, next) => {
  const { id } = request.body;
  const username = request.username
  if (!isDataValid([id])) return badRequest(response);
  todoStore.deleteTodo(username, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify({ id }));
};

const serveChangeTitle = (request, response, next) => {
  const { newTitle, id } = request.body;
  const username = request.username
  if (!isDataValid([newTitle, id])) return badRequest(response);
  todoStore.changeTitle(username, newTitle, id);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const serveChangeItem = (request, response, next) => {
  const { newItem, itemId, titleId } = request.body;
  const username = request.username
  if (!isDataValid([newItem, itemId, titleId])) return badRequest(response)
  todoStore.changeTask(username, newItem, itemId, titleId);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const signUp = function (request, response, next) {
  const { username, password } = request.body;
  if (!isDataValid([username, password])) return badRequest(response);
  if (!userFolder.userExists(username)) {
    userFolder.addUser({ username, password });
    todoStore.addNewUser(username);
  }
  response.writeHead(303, {
    'location': '/user/login.html'
  });
  response.end();
};

const checkUserNameAvailability = function (request, response) {
  const { username } = request.body;
  const userExists = userFolder.userExists(username);
  response.end(JSON.stringify({ userExists }))
}

const login = function (request, response, next) {
  const { username, password } = request.body;
  if (!isDataValid([username, password])) return badRequest(response);
  if (!userFolder.userExists(username)) {
    const data = JSON.stringify({ 'location': '/user/signup.html' })
    response.status(303);
    response.end(data);
    return;
  }
  if (userFolder.isValidUser(username, password)) {
    const sessionId = `${username}_${new Date().getTime()}`;
    sessions.createSession(sessionId, username);
    response.cookie('session_Id', sessionId);
    const data = JSON.stringify({ 'location': '/index.html' });
    response.status(303);
    response.end(data);
    return;
  }
  response.status(401)
  response.end(JSON.stringify({ 'error': 'Invalid Password' }));
}

const ensureLoggedIn = function (request, response, next) {
  const { session_Id } = request.cookies;
  const username = sessions.getAttribute(session_Id);
  if (username) {
    request.username = username;
    next();
    return;
  }
  response.writeHead(303, {
    'location': '/user/login.html'
  });
  response.end();
}

const serveMatch = (request, response, next) => {
  const { content, search } = request.body;
  const username = request.username
  if (!isDataValid([search])) return badRequest(response);
  const matchedList = todoStore.match(username, search, content);
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(matchedList));
};

const badRequest = (response) => {
  response.writeHead(400);
  response.end();
}

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
  signUp,
  login,
  ensureLoggedIn,
  checkUserNameAvailability
};

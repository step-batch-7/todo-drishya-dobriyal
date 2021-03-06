const express = require('express');
const cookieParser = require('cookie-parser');

const { router } = require('./userRouter');
const { DATA_STORE, USER_CREDENTIALS } = require('../config');

const app = express();
const {
  todoData,
  serveSaveTitle,
  serveDeleteItem,
  serveToggleStatus,
  serveChangeTitle,
  serveSaveItem,
  serveChangeItem,
  serveMatch,
  serveDeleteTitle,
  signUp,
  login,
  ensureLoggedIn,
  checkUserNameAvailability,
  logout
} = require('./handlers');

const { TodoStore } = require('./todoStore');
const { UserFolder } = require('./userFolder');

app.locals.todoStore = TodoStore.load(DATA_STORE);
app.locals.userFolder = UserFolder.loadUsers(USER_CREDENTIALS);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.post('/signUp', signUp);
app.post('/checkUserNameAvailability', checkUserNameAvailability);
app.post('/login', login);

app.use('/user', router);

app.use(ensureLoggedIn);
app.use(express.static('public'));

app.get('/logout', logout);
app.get('/todoStore.json', todoData);
app.post('/saveTitle', serveSaveTitle);
app.post('/saveItem', serveSaveItem);
app.post('/toggleStatus', serveToggleStatus);
app.post('/deleteItem', serveDeleteItem);
app.post('/deleteTitle', serveDeleteTitle);
app.post('/changeTitle', serveChangeTitle);
app.post('/changeItem', serveChangeItem);
app.post('/findGivenContent', serveMatch);

module.exports = { app };

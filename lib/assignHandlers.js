const express = require('express')

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
  signUp
} = require('./handlers');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static('public'));

app.get('/todoList.json', todoData);

app.post('/saveTitle', serveSaveTitle);
app.post('/saveItem', serveSaveItem);
app.post('/toggleStatus', serveToggleStatus);
app.post('/deleteItem', serveDeleteItem);
app.post('/deleteTitle', serveDeleteTitle);
app.post('/changeTitle', serveChangeTitle);
app.post('/changeItem', serveChangeItem);
app.post('/findGivenContent', serveMatch);
app.post('/signUp', signUp);


module.exports = { app }
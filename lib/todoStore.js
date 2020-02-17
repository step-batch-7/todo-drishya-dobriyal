const { TodoList } = require('./todo');
const fs = require('fs');

class TodoStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.todoStore = {};
  }

  static load(filePath) {
    if (!fs.existsSync(filePath)) {
      return new TodoStore(filePath);
    }
    const todoStore = new TodoStore(filePath);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
    for (const userName in content) {
      todoStore.todoStore[userName] = TodoList.load(content[userName]);
    }
    return todoStore;
  }

  addNewUser(username) {
    this.todoStore[username] = TodoList.load([]);
    this.save();
  }

  save() {
    const details = {};
    for (const userName in this.todoStore) {
      details[userName] = this.todoStore[userName].getTodoDetails();
    }
    const content = JSON.stringify(details);
    fs.writeFile(this.filePath, content, () => { });
  }

  addTitle(username, title, id) {
    const newData = this.todoStore[username].addTitle(title, id);
    this.save();
    return newData;
  }

  addItem(username, task, id) {
    const newData = this.todoStore[username].addItem(task, id);
    this.save();
    return newData;
  }

  deleteItem(username, titleId, itemId) {
    const newData = this.todoStore[username].deleteItem(titleId, itemId);
    this.save();
    return newData;
  }

  toggleStatus(username, titleId, itemId) {
    const newData = this.todoStore[username].toggleStatus(titleId, itemId);
    this.save();
    return newData;
  }

  deleteTodo(username, id) {
    const deletedTodo = this.todoStore[username].deleteTodo(id);
    this.save();
    return deletedTodo;
  }

  getList(username) {
    return this.todoStore[username].getTodoDetails();
  }

  changeTitle(username, newTitle, titleId) {
    this.todoStore[username].changeTitle(newTitle, titleId);
    this.save();
  }

  changeTask(username, newItem, itemId, titleId) {
    this.todoStore[username].changeTask(newItem, itemId, titleId);
    this.save();
  }

  match(username, search, content) {
    return this.todoStore[username].match(search, content);
  }
}

module.exports = { TodoStore };

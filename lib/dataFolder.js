const { TodoList } = require('./todo');
const fs = require('fs');

class TodoStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.todoList = [];
  }

  load() {
    if (!fs.existsSync(this.filePath)) {
      this.todoList = TodoList.load([]);
      return;
    }
    const content = JSON.parse(fs.readFileSync(this.filePath, 'utf8') || '[]');
    this.todoList = TodoList.load(content);
  }

  save() {
    const content = JSON.stringify(this.todoList.getTodoDetails());
    fs.writeFile(this.filePath, content, () => {});
  }

  addTitle(title, id) {
    const newData = this.todoList.addTitle(title, id);
    this.save();
    return newData;
  }

  addItem(task, id) {
    const newData = this.todoList.addItem(task, id);
    this.save();
    return newData;
  }

  deleteItem(titleId, itemId) {
    const newData = this.todoList.deleteItem(titleId, itemId);
    this.save();
    return newData;
  }

  toggleStatus(titleId, itemId, newStatus) {
    const newData = this.todoList.toggleStatus(titleId, itemId, newStatus);
    this.save();
    return newData;
  }

  deleteTodo(id) {
    const deletedTodo = this.todoList.deleteTodo(id);
    this.save();
    return deletedTodo;
  }

  get list() {
    return this.todoList.getTodoDetails();
  }

  changeTitle(newTitle, titleId) {
    this.todoList.changeTitle(newTitle, titleId);
    this.save();
  }

  changeTask(newItem, itemId, titleId) {
    this.todoList.changeTask(newItem, itemId, titleId);
    this.save();
  }

  match(search, content) {
    return this.todoList.match(search, content);
  }
}

module.exports = { TodoStore };

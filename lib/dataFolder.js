const fs = require('fs');
const { TodoList } = require('./todo');

class DataFolder {
  constructor(filePath) {
    this.filePath = filePath;
    this.todoList = '';
  }
  load() {
    if (!fs.existsSync(this.filePath)) {
      this.todoList = TodoList.load([]);
      return;
    }
    const content = JSON.parse(fs.readFileSync(this.filePath, 'utf8') || '[]');
    this.todoList = TodoList.load(content);
  }
  addTitle(title, id) {
    const newData = this.todoList.addTitle(title, id);
    this.saveData();
    return newData;
  }
  addItem(task, id) {
    const newData = this.todoList.addItem(task, id);
    this.saveData();
    return newData;
  }
  deleteItem(titleId, itemId) {
    const newData = this.todoList.deleteItem(titleId, itemId);
    this.saveData();
    return newData;
  }
  toggleStatus(titleId, itemId, newStatus) {
    const newData = this.todoList.toggleStatus(titleId, itemId, newStatus);
    this.saveData();
    return newData;
  }
  deleteTodo(id) {
    const deletedTodo = this.todoList.deleteTodo(id);
    this.saveData();
    return deletedTodo;
  }
  saveData() {
    const content = JSON.stringify(this.todoList.getTodoDetails());
    fs.writeFile(this.filePath, content, () => { });
  }
  getTasksDetails() {
    return this.todoList.getTodoDetails();
  }
}

module.exports = { DataFolder }
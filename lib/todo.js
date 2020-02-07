const fs = require('fs');

class Task {
  constructor(item, id, statusCode) {
    this.item = item;
    this.id = id;
    this.statusCode = statusCode;
  };
  getTask() {
    return {
      item: this.item,
      id: this.id,
      statusCode: this.statusCode
    };
  };
};

class Todo {
  constructor(title, id) {
    this.title = title;
    this.id = id;
    this.tasks = [];
  };
  static create(newTodo) {
    const { title, id, tasks } = newTodo;
    const todo = new Todo(title, id);
    tasks.forEach(task => {
      const { item, id, statusCode } = task;
      todo.tasks.push(new Task(item, id, statusCode));
    });
    return todo;
  };
  getTodo() {
    return {
      title: this.title,
      id: this.id,
      tasks: this.tasks.map(task => task.getTask())
    }
  };
  getTodoFromId(itemId) {
    return this.tasks.find(task => {
      return task.id === itemId;
    });
  };
  deleteTask(itemId) {
    const itemIndexId = this.getTodoFromId(itemId);
    this.tasks.splice(itemIndexId, 1);
  };
};

class TodoList {
  constructor() {
    this.list = [];
  }
  static load(content) {
    const newTodoList = new TodoList();
    content.forEach(todo => {
      newTodoList.list.push(Todo.create(todo));
    });
    return newTodoList;
  };
  getTodoList() {
    return this.list.map((todo) => todo.getTodo());
  };
  addTitle(title, id) {
    this.list.push(Todo.create({ title, id, tasks: [] }));
  };
  getTodoFromId(titleId) {
    return this.list.find(todo => {
      return todo.id === titleId;
    });
  };
  addItem(task, titleId) {
    const { item, id, statusCode } = task;
    const editedTodo = this.getTodoFromId(titleId);
    const newTask = new Task(item, id, statusCode);
    editedTodo.tasks.push(newTask);
  };
  deleteItem(titleId, itemId) {
    const editedTodo = this.getTodoFromId(titleId);
    editedTodo.deleteTask(itemId);
  }
};

module.exports = { TodoList };
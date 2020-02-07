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
  }
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
  }
};

module.exports = { TodoList };
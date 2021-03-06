class Todo {
  constructor(title, id) {
    this.title = title;
    this.id = id;
    this.tasks = [];
  }
  static create(newTodo) {
    const { title, id, tasks } = newTodo;
    const todo = new Todo(title, id);
    tasks.forEach(task => {
      const { item, id, statusCode } = task;
      todo.tasks.push({ item, id, statusCode });
    });
    return todo;
  }
  getTodo() {
    return {
      title: this.title,
      id: this.id,
      tasks: [...this.tasks]
    };
  }
  getTaskFromId(itemId) {
    return this.tasks.find(task => {
      return task.id === itemId;
    });
  }
  deleteTask(itemId) {
    const itemIndexId = this.tasks.indexOf(this.getTaskFromId(itemId));
    // eslint-disable-next-line no-magic-numbers
    this.tasks.splice(itemIndexId, 1);
  }
  toggleStatus(itemId) {
    const editedTask = this.getTaskFromId(itemId);
    editedTask.statusCode = !editedTask.statusCode;
  }
  changeTitle(newTitle) {
    this.title = newTitle;
  }
  changeTask(taskId, newItem) {
    const editedTask = this.getTaskFromId(taskId);
    editedTask.item = newItem;
  }
  match(content) {
    return this.tasks.some(task => {
      return task.item.includes(content);
    });
  }
}

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
  }
  getTodoDetails() {
    return [...this.list];
  }
  addTitle(title, id) {
    const newTodo = Todo.create({ title, id, tasks: [] });
    this.list.push(newTodo);
    return newTodo.getTodo();
  }
  getTodoFromId(titleId) {
    return this.list.find(todo => {
      return todo.id === titleId;
    });
  }
  addItem(task, titleId) {
    const { item, id } = task;
    const editedTodo = this.getTodoFromId(titleId);
    const newTask = { item, id, statusCode: false };
    editedTodo.tasks.push(newTask);
    return newTask;
  }
  deleteItem(todoId, taskId) {
    const editedTodo = this.getTodoFromId(todoId);
    editedTodo.deleteTask(taskId);
  }
  toggleStatus(titleId, itemId) {
    const editedTodo = this.getTodoFromId(titleId);
    editedTodo.toggleStatus(itemId);
  }
  deleteTodo(titleId) {
    const deleteTodo = this.getTodoFromId(titleId);
    const deleteTodoIndex = this.list.indexOf(deleteTodo);
    // eslint-disable-next-line no-magic-numbers
    this.list.splice(deleteTodoIndex, 1);
  }
  changeTitle(newTitle, titleId) {
    const editedTodo = this.getTodoFromId(titleId);
    editedTodo.changeTitle(newTitle);
  }
  changeTask(newTask, taskId, titleId) {
    const editedTodo = this.getTodoFromId(titleId);
    editedTodo.changeTask(taskId, newTask);
  }
  match(search, content) {
    if (search === 'title') {
      return this.list.filter(todo => {
        return todo.title.includes(content);
      });
    }
    return this.list.filter(todo => todo.match(content));
  }
}

module.exports = { TodoList, Todo };

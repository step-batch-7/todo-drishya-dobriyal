const { TodoList } = require('../lib/todo');
const { assert } = require('chai');

describe('TodoList', () => {
  describe('addTitle', function() {
    const data = [
      {
        title: 'science',
        id: 'T_2',
        tasks: [
          { item: 'chapter1', id: 'I_3', statusCode: false },
          { item: 'chapter2', id: 'I_4', statusCode: false }
        ]
      }
    ];
    const todoList = TodoList.load(data);
    it('should add the title in the given file', function() {
      const newTodo = todoList.addTitle('hello', 'T_3');
      assert.strictEqual(newTodo.title, 'hello');
      assert.strictEqual(newTodo.id, 'T_3');
    });
  });

  describe('addItem', function() {
    const data = [
      {
        title: 'english',
        id: 'T_1',
        tasks: [
          { item: 'topic1', id: 'I_1', statusCode: false },
          { item: 'topic2', id: 'I_2', statusCode: false }
        ]
      }
    ];
    const todoList = TodoList.load(data);
    it('should add the given item to the given todo', function() {
      const task = { item: 'hey', id: 'I_6' };
      const newItem = todoList.addItem(task, 'T_1');
      assert.strictEqual(newItem.id, 'I_6');
      assert.strictEqual(newItem.item, 'hey');
    });
  });
});

const { TodoList, Todo } = require('../lib/todo');

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

  describe('deleteItem', function() {
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
    it('should delete the given item in the given todo', function() {
      todoList.deleteItem('T_1', 'I_1');
      const todo = todoList.getTodoFromId('T_1');
      assert.isUndefined(todo.getTaskFromId('I_1'));
    });
  });

  describe('deleteTodo', function() {
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
    it('should delete the given todo from todoList', function() {
      todoList.deleteTodo('T_1');
      assert.isUndefined(todoList.getTodoFromId('T_1'));
    });
  });

  describe('changeTitle', function() {
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
    it('should change the title for given todo ', function() {
      todoList.changeTitle('hello', 'T_1');
      const modifiedTodo = todoList.getTodoFromId('T_1');
      assert.strictEqual(modifiedTodo.title, 'hello');
    });
  });

  describe('changeTask', function() {
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
    it('should change the item for given todo', function() {
      todoList.changeTask('wash', 'I_1', 'T_1');
      const modifiedTodo = todoList.getTodoFromId('T_1');
      assert.strictEqual(modifiedTodo.getTaskFromId('I_1').item, 'wash');
      assert.strictEqual(modifiedTodo.getTaskFromId('I_1').id, 'I_1');
    });
  });

  describe('match', function() {
    const data = [
      {
        title: 'english',
        id: 'T_1',
        tasks: [
          { item: 'topic1', id: 'I_1', statusCode: false },
          { item: 'topic2', id: 'I_2', statusCode: false }
        ]
      },
      {
        title: 'components',
        id: 'T_2',
        tasks: [
          { item: 'component1', id: 'I_5', statusCode: false },
          { item: 'component2', id: 'I_6', statusCode: false }
        ]
      }
    ];
    const todoList = TodoList.load(data);
    it('should match the given title', function() {
      const expected = [
        {
          title: 'english',
          id: 'T_1',
          tasks: [
            { item: 'topic1', id: 'I_1', statusCode: false },
            { item: 'topic2', id: 'I_2', statusCode: false }
          ]
        }
      ];
      const matched = todoList.match('title', 'eng');
      assert.deepStrictEqual(matched, expected);
    });

    it('should give empty if no match found for title', () => {
      const expected = [];
      const matched = todoList.match('title', '4566');
      assert.deepStrictEqual(matched, expected);
    });

    it('should match the given title', function() {
      const expected = [
        {
          title: 'english',
          id: 'T_1',
          tasks: [
            { item: 'topic1', id: 'I_1', statusCode: false },
            { item: 'topic2', id: 'I_2', statusCode: false }
          ]
        }
      ];
      const matched = todoList.match('task', 'to');
      assert.deepStrictEqual(matched, expected);
    });

    it('should give empty if no match found for task', () => {
      const expected = [];
      const matched = todoList.match('task', 'task4566');
      assert.deepStrictEqual(matched, expected);
    });
  });
});

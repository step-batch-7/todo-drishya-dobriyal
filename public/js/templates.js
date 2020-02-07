const defaultCheckBox = () => `<input type="checkBox" onclick="toggleStatus"></input>`;

const createNewItemTemplate = ({ id, statusCode, item }) => {
  statusCode ? statusCode = 'checked' : statusCode = '';
  const li = document.createElement('li');
  li.setAttribute('id', id);
  li.innerHTML = `<input type="checkBox" onclick="toggleStatus()" ${statusCode}>
               ${item}
               <div onclick="deleteItem()" class="deleteItem" style='display: flex; justify-content: space-evenly'> - </div>`;
  return li;
};

const createItemTemplate = ({ id, statusCode, item }) => {
  statusCode ? statusCode = 'checked' : statusCode = '';
  return `<li id='${id}'>
           <input type="checkBox" onclick="toggleStatus()" ${statusCode}>
           ${item}
           <div onclick="deleteItem()" class="deleteItem" style='display: flex; justify-content: space-evenly'> - </div>
          </li>`;
};

const createTodoTemplate = (todo) => {
  let todoTemplate = `<div id="details">
  <h2 id="${todo.id}">${todo.title}<h2>
  <button onclick="addNewItem()">Add New Item</button>`;
  todo.tasks.forEach(task => {
    todoTemplate += createItemTemplate(task);
  });
  return todoTemplate;
};

const newItemTemplate = () => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.innerHTML =
    `${defaultCheckBox()}
      <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="saveNewItem()" class="newItem"> + </div>
      <div onclick="deleteItem()" class="deleteItem"> - </div>`;
  return div
};

const showTitleTemplate = () => {
  return `<label> TITLE</label> <br>
    <input type="text" name="title" id="title" required></input>
    <button onclick="saveTitle()">DONE</button>`
}

const displayNewTitle = (id, title) => {
  const li = document.createElement('li');
  li.setAttribute('id', id);
  li.setAttribute('onclick', displayTodo);
  li.innerText = title;
  return li;
};

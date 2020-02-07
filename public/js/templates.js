const createItemTemplate = ({ id, statusCode, item }) => {
  statusCode ? statusCode = 'checked' : statusCode = '';
  return `
           <li id='${id}'>
           <input type="checkBox" onclick="toggleStatus()" ${statusCode}>
           ${item}
           <div onclick="deleteItem()" class="deleteItem"  id='${id}' style='display: flex; justify-content: space-evenly'> - </div>
           </li>
          `;
};

// const createTodoTemplate = (todo) => {
//   let todoTemplate = `<div id="details">
//   <div><h2 id="${todo.id}">${todo.title}</h2><div><i class="fa fa-trash-o" aria-hidden="true" id='${todo.id}' onclick='deleteTitle()'></div><div>
//   <button onclick="addNewItem()">Add New Item</button>`;
//   todo.tasks.forEach(task => {
//     todoTemplate += createItemTemplate(task);
//   });
//   return todoTemplate;
// };

const createTodoTemplate = (todo) => {
  const { title, id, tasks } = todo;
  let todoTemplate =
    `<div id='${id}'>
    <div><h2 >${title}</h2></div>
    <div id='${id}'>`;
  todo.tasks.forEach(task => {
    todoTemplate += createItemTemplate(task);
  });
  todoTemplate += `</div id='${id}'><button onclick="addNewItem()" id='${id}'>Add New Item</button>
     <div id='${id}'><i class="fa fa-trash-o" aria-hidden="true" id='${id}' onclick='deleteTitle()'></div></div>`
  return todoTemplate;
}

const showTitleTemplate = () => {
  return `<label> TITLE</label> <br>
         <input type="text" name="title" id="title" required></input>
        <button onclick="saveTitle()">DONE</button>`
}

const createNewItemTemplate = ({ id, statusCode, item }) => {
  statusCode ? statusCode = 'checked' : statusCode = '';
  const li = document.createElement('li');
  li.setAttribute('id', id);
  li.innerHTML = `<input type="checkBox" onclick="toggleStatus()" ${statusCode}>
               ${item}
               <div onclick="deleteItem()" class="deleteItem" id='${id}' style='display: flex; justify-content: space-evenly'> - </div>`;
  return li;
};

const newItemTemplate = (id) => {
  const div = document.createElement('div');
  div.classList.add('newItem');
  div.setAttribute('id', id);
  div.innerHTML =
    `<input type="checkBox" onclick="toggleStatus"></input>
      <textarea rows="2" cols="105" type="text" required></textarea>
      <div onclick="saveNewItem()" class="newItem"  id='${id}'> + </div>
      <div onclick="deleteItem()" class="deleteItem"  id='${id}'> - </div>`;
  return div;
};

const displayNewTitle = (id, title) => {
  const div = document.createElement('div');
  div.setAttribute('id', id);
  div.setAttribute('class', 'titles');
  div.innerHTML = `<div onclick="displayTodo()" id='${id}'>${title}</div>
      <div><i class="fa fa-trash-o" aria-hidden="true" id='${id}' onclick='deleteTitle()'></i>
    </div>`;
  return div;
};

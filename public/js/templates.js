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

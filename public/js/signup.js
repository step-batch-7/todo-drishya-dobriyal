const signUp = function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const callback = () => console.log(username, password);
  const postBody = JSON.stringify({ username, password });
  sendNewRequest('POST', '/signUp', postBody, callback);
};

const sendNewRequest = function (method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    callback(xhr.responseText);
  };
  xhr.open(method, url);
  xhr.send(data);
};

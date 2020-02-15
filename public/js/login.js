const loadLogin = function () {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const data = JSON.stringify({ username, password });
  const callback = (response) => {
    const { error, location } = JSON.parse(response);
    if (error) {
      document.getElementById('error').innerText = error;
      return;
    }
    window.location.href = location
  }
  sendNewRequest('POST', '/login', data, callback);
}

const sendNewRequest = function (method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    callback(xhr.responseText);
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(data);
};

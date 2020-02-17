/* eslint-disable no-unused-vars */
const checkUsername = function(event) {
  const username = event.target.value;
  const callback = response => {
    const { userExists } = JSON.parse(response);
    if (userExists) {
      document.getElementById('username').style.outlineColor = 'red';
      document.getElementById('existingStatus').innerText =
        'user already exists';
      document.getElementById('signup').disabled = true;
    } else {
      document.getElementById('username').style.outlineColor = 'cornflowerBlue';
      document.getElementById('existingStatus').innerText = '';
      document.getElementById('signup').disabled = false;
    }
  };
  const data = JSON.stringify({ username });
  sendNewRequest('POST', '/checkUserNameAvailability', data, callback);
};

const requestSignUp = function() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmedPassword = document.getElementById('confirmPassword').value;
  const callback = data => {
    const { location } = JSON.parse(data);
    window.location.href = location;
  };
  if (!password || password !== confirmedPassword) {
    document.getElementById('existingStatus').innerText = 'Invalid Password ';
    return;
  }
  const data = JSON.stringify({ username, password });
  username && sendNewRequest('POST', '/signUp', data, callback);
};

const sendNewRequest = function(method, url, data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    callback(xhr.responseText);
  };
  xhr.open(method, url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
};

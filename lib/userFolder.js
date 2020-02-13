const fs = require('fs');

class UserFolder {
  constructor(userCredentials, path) {
    this.path = path;
    this.userCredentials = userCredentials;
  }

  static loadUsers(path) {
    const userData = fs.readFileSync(path, 'utf8') || '[]';
    return new UserFolder(JSON.parse(userData), path);
  }

  userExists(username) {
    return this.userCredentials.some(
      userData => userData.username === username
    );
  }
  addUser(newUserData) {
    this.userCredentials.push(newUserData);
    console.log(this.path)
    this.save();
  }

  save() {
    fs.writeFile(this.path, JSON.stringify(this.userCredentials), () => { });
  }
}

module.exports = { UserFolder };

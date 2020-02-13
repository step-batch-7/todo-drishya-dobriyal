class SessionManager {
  constructor() {
    this.sessions = {};
  }

  createSession(id, todoStore) {
    this.sessions[id] = todoStore;
  }

  getSession(id) {
    return this.sessions[id];
  }
}

module.exports = { SessionManager }
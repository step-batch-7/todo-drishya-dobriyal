class SessionManager {
  constructor() {
    this.sessions = {};
  }

  createSession(id, username) {
    this.sessions[id] = username;
  }

  getSession(id) {
    return this.sessions[id];
  }

  getAttribute(id) {
    return this.sessions[id];
  }
}

module.exports = { SessionManager }
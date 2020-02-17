class SessionManager {
  constructor() {
    this.sessions = {};
    this.nextId = 100;
  }

  generateId() {
    return this.nextId++;
  }

  createSession(username) {
    const id = this.generateId();
    this.sessions[id] = username;
    return id;
  }

  getSession(id) {
    return this.sessions[id];
  }

  getAttribute(id) {
    return this.sessions[id];
  }

  deleteSession(id) {
    delete this.sessions[id];
  }
}

const sessions = new SessionManager();

module.exports = { sessions };

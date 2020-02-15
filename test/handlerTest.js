const fs = require('fs');
const request = require('supertest');
const sinon = require('sinon');
const { sessions } = require('../lib/sessionManager')

const { app } = require('../lib/assignHandlers');

describe('GET method', function () {
  beforeEach(() => {
    sessions.createSession('user_123', 'user')
  });
  it('for home page for / url', function (done) {
    request(app)
      .get('/')
      .set('cookie', 'session_Id=user_123')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app)
      .get('/css/style.css')
      .set('cookie', 'session_Id=user_123')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app)
      .get('/js/todoSubmit.js')
      .set('cookie', 'session_Id=user_123')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('for /todoData', function (done) {
    request(app)
      .get('/todoStore.json')
      .set('cookie', 'session_Id=user_123')
      .set('Accept', '*/*')
      .expect(200, done);
  });
  it('for /logout', function (done) {
    request(app)
      .get('/logout')
      .set('cookie', 'session_Id=user_123')
      .expect(200, done)
      .expect(/login.html/)
  });
  it('for /badFile', function (done) {
    request(app)
      .get('/badFile.html')
      .set('Accept', '*/*')
      .expect(303, done);
  });
});

describe('POST saveData', function () {
  beforeEach(() => {
    const fake = sinon.fake();
    sinon.replace(fs, 'writeFile', fake);
    sessions.createSession('user_123', 'user')
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('save title', function () {
    it('should save title on /saveTitle Req', function (done) {
      request(app)
        .post('/saveTitle')
        .set('Content-type', 'application/json')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });

    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/saveTitle')
        .send('{"title":"Bat"}')
        .expect(303, done);
    });

    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"tite":"Bat"}')
        .expect(400, done);
    });
  });
  describe('save item', function () {
    it('should save item on /saveItem Req', function (done) {
      request(app)
        .post('/saveItem')
        .set('Content-type', 'application/json')
        .set('cookie', 'session_Id=user_123')
        .send(
          '{ "task": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }'
        )
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });

    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/saveItem')
        .send(
          '{ "tas": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }'
        )
        .expect(303, done);
    });

    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('delete item', function () {
    it('should delete item on /deleteItem Req', function (done) {
      request(app)
        .post('/deleteItem')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "itemId": "I_2", "titleId":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/deleteItem')
        .send('{ "itemI": "I_2", "titleId":"T_1" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('delete title', function () {
    it('should delete title on /deleteTitle Req', function (done) {
      request(app)
        .post('/deleteTitle')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "id":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/deleteTitle')
        .set('Content-type', 'application/json')
        .send('{ "id": "T_1" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('toggle status', function () {
    it('should toggle status on /toggleStatus Req', function (done) {
      request(app)
        .post('/toggleStatus')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "itemId": "I_3", "titleId":"T_2"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/toggleStatus')
        .set('Content-type', 'application/json')
        .send('{ "itemId": "I_3", "titleId":"T_2"}')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('change item', function () {
    it('should change item on /changeItem req ', function (done) {
      request(app)
        .post('/changeItem')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "newItem": "subject", "titleId":"T_2", "itemId":"I_3" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/changeItem')
        .set('Content-type', 'application/json')
        .send('{ "newItem": "subject", "titleId":"T_2", "itemId":"I_3" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('change title', function () {
    it('should change title on /changeTitle req ', function (done) {
      request(app)
        .post('/changeTitle')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "newTitle": "subject", "id":"T_2" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/changeTitle')
        .set('Content-type', 'application/json')
        .send('{ "newTitle": "subject", "id":"T_2" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('search title', function () {
    it('should search title on /findGivenContent req ', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "content": "components", "search":"title" }')
        .expect(200, done)
        .expect(/components/)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "content": "components", "search":"title" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{"title":"Bat"}')
        .expect(400, done);
    });
  });
  describe('search task', function () {
    it('should search task on /findGivenContent req ', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('cookie', 'session_Id=user_123')
        .set('Content-type', 'application/json')
        .send('{ "content": "component1", "search":"item" }')
        .expect(200, done)
        .expect(/component1/)
        .expect('Content-Type', 'application/json');
    });
    it('should redirect to login if cookie is not set', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "content": "component1", "search":"item" }')
        .expect(303, done);
    });
    it('should give bad request if given data is incorrect', function (done) {
      request(app)
        .post('/saveTitle')
        .set('cookie', 'session_Id=user_123')
        .send('{ "contt": "component1", "seach":"item" }')
        .expect(400, done);
    });
  });
});

describe('method not Handled', function () {
  it('should give method not allowed for unhandled method', function (done) {
    request(app)
      .put('/saveTitle')
      .set('Accept', '*/*')
      .send('{"title":"Bat"}')
      .expect(303, done);
  });
});

describe("signUp", function () {
  beforeEach(() => {
    const fake = sinon.fake();
    sinon.replace(fs, 'writeFile', fake);
    sessions.createSession('user_123', 'user')
  });
  afterEach(() => {
    sinon.restore();
  });

  it("should register new user", function (done) {
    request(app)
      .post('/signUp')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send('username=drishya&password=drishya')
      .expect(303, done)
      .expect('location', '/user/login.html')
  })

  it(" should give bad request if given data is incorrect", function (done) {
    request(app)
      .post('/signUp')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send('usernae=drishya&password=drishya')
      .expect(400, done)
  })

  it("should redirect to login if username already exists", function (done) {
    request(app)
      .post('/signUp')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send('username=user&password=user')
      .expect(303, done)
      .expect('location', '/user/login.html')
  })

  describe("checkUserNameAvailability", function () {
    it("should give true if username exists", function (done) {
      request(app)
        .post('/checkUserNameAvailability')
        .set('Content-type', 'application/json')
        .send('{"username":"user"}')
        .expect(200, done)
        .expect(/true/)
    })
    it("should give false if username do  not exists", function (done) {
      request(app)
        .post('/checkUserNameAvailability')
        .set('Content-type', 'application/json')
        .send('{"username":"us"}')
        .expect(200, done)
        .expect(/false/)
    })
  });
});

describe("Login", function () {
  it("should give invalid password for incorrect password", function (done) {
    request(app)
      .post('/login')
      .set('Content-type', 'application/json')
      .send('{"username":"user","password":"incorrectPassword"}')
      .expect(401, done)
      .expect(/Invalid/)
  })

  it("should redirect to signUp page if user is not present", function (done) {
    request(app)
      .post('/login')
      .set('Content-type', 'application/json')
      .send('{"username":"unauthorizedUser","password":"password"}')
      .expect(303, done)
      .expect(/user\/signup.html/)
  })

  it("should give me cookie back if user and password are valid", function (done) {
    request(app)
      .post('/login')
      .set('Content-type', 'application/json')
      .send('{ "username": "user", "password": "user" }')
      .expect(303, done)
      .expect(/index.html/)
      .expect('Set-Cookie', /session_Id=user/)
  })

  it("should give bad request if data is not valid", function (done) {
    request(app)
      .post('/login')
      .set('Content-type', 'application/json')
      .send('{ "user": "user", "password": "user" }')
      .expect(400, done)
  })
});

describe("ensureLoggedIn", function () {
  beforeEach(() => {
    sessions.createSession('user_123', 'user');
  });
  it("should give 200 OK if cookie is created for given username", function (done) {
    request(app)
      .get('/index.html')
      .set('cookie', 'session_Id=user_123')
      .expect(200, done)
  })

  it("should redirect /user/login.html if cookie is not created for given username", function (done) {
    request(app)
      .get('/index.html')
      .set('cookie', 'session_Id=user_13')
      .expect(303, done)
      .expect('location', '/user/login.html')
  })
});
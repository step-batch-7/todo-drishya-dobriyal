const fs = require('fs');
const request = require('supertest');
const { DATA_STORE } = require('../config');
const { app } = require('../lib/assignHandlers');

describe('GET method', function () {
  it('for home page for / url', function (done) {
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app.serve.bind(app))
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('Content-Type', /css/)
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app.serve.bind(app))
      .get('/js/todoSubmit.js')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/javascript/)
      .expect(200, done);
  });
  it('for /todoData', function (done) {
    request(app.serve.bind(app))
      .get('/todoList.json')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
  it('for /badFile', function (done) {
    request(app.serve.bind(app))
      .get('/badFile.html')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});


describe("POST saveData", function () {
  let dataStore;
  beforeEach(() => {
    dataStore = fs.readFileSync(DATA_STORE, 'utf8');
  })
  afterEach(() => {
    fs.writeFileSync(DATA_STORE, dataStore);
  })
  describe("save title", function () {
    it('should save title on /saveTitle Req', function (done) {
      request(app.serve.bind(app))
        .post('/saveTitle')
        .set('Accept', '*/*')
        .send('{"title":"Bat"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("save item", function () {
    it('should save item on /saveItem Req', function (done) {
      request(app.serve.bind(app))
        .post('/saveItem')
        .set('Accept', '*/*')
        .send('{ "task": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("delete item", function () {
    it('should delete item on /deleteItem Req', function (done) {
      request(app.serve.bind(app))
        .post('/deleteItem')
        .set('Accept', '*/*')
        .send('{ "itemId": "I_2", "titleId":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("delete title", function () {
    it('should delete title on /deleteTitle Req', function (done) {
      request(app.serve.bind(app))
        .post('/deleteTitle')
        .set('Accept', '*/*')
        .send('{ "titleId":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("toggle status", function () {
    it('should toggle status on /toggleStatus Req', function (done) {
      request(app.serve.bind(app))
        .post('/toggleStatus')
        .set('Accept', '*/*')
        .send('{ "itemId": "I_3", "titleId":"T_2" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("change item", function () {
    it('should change item on /changeItem req ', function (done) {
      request(app.serve.bind(app))
        .post('/changeItem')
        .set('Accept', '*/*')
        .send('{ "newItem": "subject", "titleId":"T_2", "itemId":"I_3" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("change title", function () {
    it('should change title on /changeTitle req ', function (done) {
      request(app.serve.bind(app))
        .post('/changeTitle')
        .set('Accept', '*/*')
        .send('{ "newTitle": "subject", "id":"T_2" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("search title", function () {
    it('should search title on /findGivenContent req ', function (done) {
      request(app.serve.bind(app))
        .post('/findGivenContent')
        .set('Accept', '*/*')
        .send('{ "content": "components", "search":"title" }')
        .expect(200, done)
        .expect(/components/)
        .expect('Content-Type', 'application/json')
    });
  });
  describe("search task", function () {
    it('should search task on /findGivenContent req ', function (done) {
      request(app.serve.bind(app))
        .post('/findGivenContent')
        .set('Accept', '*/*')
        .send('{ "content": "component1", "search":"item" }')
        .expect(200, done)
        .expect(/component1/)
        .expect('Content-Type', 'application/json')
    });
  });
});

describe("method not Handled", function () {
  it("should give method not allowed for unhandled method", function (done) {
    request(app.serve.bind(app))
      .put('/saveTitle')
      .set('Accept', '*/*')
      .send('{"title":"Bat"}')
      .expect(400, done)
  })
});

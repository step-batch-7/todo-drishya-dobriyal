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
  before(() => {
    dataStore = fs.readFileSync(DATA_STORE, 'utf8');
  })
  after(() => {
    fs.writeFileSync(DATA_STORE, dataStore);
  })
  it('should save title on /saveTitle Req', function (done) {
    request(app.serve.bind(app))
      .post('/saveTitle')
      .set('Accept', '*/*')
      .send('{"title":"Bat"}')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
  });
  it('should save item on /saveItem Req', function (done) {
    request(app.serve.bind(app))
      .post('/saveItem')
      .set('Accept', '*/*')
      .send('{ "task": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
  });
  it('should delete item on /deleteItem Req', function (done) {
    request(app.serve.bind(app))
      .post('/deleteItem')
      .set('Accept', '*/*')
      .send('{ "itemId": "I_1", "titleId":"T_1" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
  });
  it('should delete item on /deleteTitle Req', function (done) {
    request(app.serve.bind(app))
      .post('/deleteTitle')
      .set('Accept', '*/*')
      .send('{ "titleId":"T_1" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
  });
  it('should delete item on /toggleStatus Req', function (done) {
    request(app.serve.bind(app))
      .post('/toggleStatus')
      .set('Accept', '*/*')
      .send('{ "itemId": "I_3", "titleId":"T_2" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
  });
  it('should change title on /changeTitle req ', function (done) {
    request(app.serve.bind(app))
      .post('/changeTitle')
      .set('Accept', '*/*')
      .send('{ "newTitle": "subject", "id":"T_2" }')
      .expect(200, done)
      .expect('Content-Type', 'application/json')
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
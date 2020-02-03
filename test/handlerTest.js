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
});

const fs = require('fs');
const request = require('supertest');
const sinon = require('sinon');
const { DATA_STORE } = require('../config');
// const express = require('express');

const { app } = require('../lib/assignHandlers');

describe('GET method', function () {
  it('for home page for / url', function (done) {
    request(app)
      .get('/')
      .set('Accept', '*/*')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app)
      .get('/css/style.css')
      .set('Accept', '*/*')
      .expect('Content-Type', /css/)
      .expect(200, done);
  });
  it('for any other url with given content type', function (done) {
    request(app)
      .get('/js/todoSubmit.js')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/javascript/)
      .expect(200, done);
  });
  it('for /todoData', function (done) {
    request(app)
      .get('/todoList.json')
      .set('Accept', '*/*')
      .expect('Content-Type', /application\/json/)
      .expect(200, done);
  });
  it('for /badFile', function (done) {
    request(app)
      .get('/badFile.html')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});

describe('POST saveData', function () {
  beforeEach(() => {
    const fake = sinon.fake();
    sinon.replace(fs, 'writeFile', fake);
  });
  afterEach(() => {
    sinon.restore();
  });
  describe('save title', function () {
    it('should save title on /saveTitle Req', function (done) {
      request(app)
        .post('/saveTitle')
        .set('Content-type', 'application/json')
        .send('{"title":"Bat"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });

    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/saveTitle')
        .send('{"titl":"Bat"}')
        .expect(404, done);
    });
  });
  describe('save item', function () {
    it('should save item on /saveItem Req', function (done) {
      request(app)
        .post('/saveItem')
        .set('Content-type', 'application/json')
        .send(
          '{ "task": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }'
        )
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });

    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/saveItem')
        .send(
          '{ "tas": { "item": "new Item", "statusCode": "false" }, "id":"T_1" }'
        )
        .expect(404, done);
    });
  });
  describe('delete item', function () {
    it('should delete item on /deleteItem Req', function (done) {
      request(app)
        .post('/deleteItem')
        .set('Content-type', 'application/json')
        .send('{ "itemId": "I_2", "titleId":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/deleteItem')
        .send('{ "itemI": "I_2", "titleId":"T_1" }')
        .expect(404, done);
    });
  });
  describe('delete title', function () {
    it('should delete title on /deleteTitle Req', function (done) {
      request(app)
        .post('/deleteTitle')
        .set('Content-type', 'application/json')
        .send('{ "id":"T_1" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/deleteTitle')
        .set('Content-type', 'application/json')
        .send('{ "iderfger":"T_1" }')
        .expect(404, done);
    });
  });
  describe('toggle status', function () {
    it('should toggle status on /toggleStatus Req', function (done) {
      request(app)
        .post('/toggleStatus')
        .set('Content-type', 'application/json')
        .send('{ "itemId": "I_3", "titleId":"T_2"}')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/toggleStatus')
        .set('Content-type', 'application/json')
        .send('{ "iemId": "I_3", "titleId":"T_2" }')
        .expect(404, done);
    });
  });
  describe('change item', function () {
    it('should change item on /changeItem req ', function (done) {
      request(app)
        .post('/changeItem')
        .set('Content-type', 'application/json')
        .send('{ "newItem": "subject", "titleId":"T_2", "itemId":"I_3" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/changeItem')
        .set('Content-type', 'application/json')
        .send('{ "newIewqftem": "subject", "titleId":"T_2", "itemId":"I_3" }')
        .expect(404, done);
    });
  });
  describe('change title', function () {
    it('should change title on /changeTitle req ', function (done) {
      request(app)
        .post('/changeTitle')
        .set('Content-type', 'application/json')
        .send('{ "newTitle": "subject", "id":"T_2" }')
        .expect(200, done)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/changeTitle')
        .set('Content-type', 'application/json')
        .send('{ "title": "subject", "id":"T_2" }')
        .expect(404, done);
    });
  });
  describe('search title', function () {
    it('should search title on /findGivenContent req ', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "content": "components", "search":"title" }')
        .expect(200, done)
        .expect(/components/)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "contnt": "components", "seach":"title" }')
        .expect(404, done);
    });
  });
  describe('search task', function () {
    it('should search task on /findGivenContent req ', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "content": "component1", "search":"item" }')
        .expect(200, done)
        .expect(/component1/)
        .expect('Content-Type', 'application/json');
    });
    it('should give bad request if data is not appropriate', function (done) {
      request(app)
        .post('/findGivenContent')
        .set('Content-type', 'application/json')
        .send('{ "contnt": "components", "serch":"item" }')
        .expect(404, done);
    });
  });
});

describe('method not Handled', function () {
  it('should give method not allowed for unhandled method', function (done) {
    request(app)
      .put('/saveTitle')
      .set('Accept', '*/*')
      .send('{"title":"Bat"}')
      .expect(404, done);
  });
});

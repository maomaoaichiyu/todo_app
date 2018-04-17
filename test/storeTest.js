'use strict';
let expect = require('chai').expect;
let store = require('../mongoStore');

describe('MongoDB Store', function() {

  before(() => store.init('mongodb://localhost:27017', 'todo'))

  after(() => store.close())
  
  describe('getAllTasks()', function() {

    beforeEach(() => store.reset())

    it('should return empty array by default', function(done) {
      store.getAllTasks()
        .then((tasks) => {
          expect(tasks.length).to.be.equal(0);
          done();
        });
    });

    it('should return all tasks', function(done) {
      store.createTaskAndReturnID({text: 'test1'})
        .then(() => store.createTaskAndReturnID({text: 'test2'}))
        .then(() => store.getAllTasks())
        .then((tasks) => {
          expect(tasks.length).to.be.equal(2);
          done();
        });
    });
  });
});

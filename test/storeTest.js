'use strict';
let expect = require('chai').expect;
let store = require('../mongoStore');

describe('MongoDB Store', function() {

  before(() => store.init('mongodb://localhost:27017', 'todo'));

  after(() => store.close());

  describe('getAllTasks()', function() {

    beforeEach(() => store.reset());

    it('should return empty array by default', function(done) {
      store.getAllTasks()
        .then((tasks) => {
          expect(tasks.length).to.be.equal(0);
          done();
        })
        .catch(done);
    });

    it('should return all tasks', function(done) {
      store.createTaskAndReturnID({text: 'test1'})
        .then(() => store.createTaskAndReturnID({text: 'test2'}))
        .then(() => store.getAllTasks())
        .then((tasks) => {
          expect(tasks.length).to.be.equal(2);
          done();
        })
        .catch(done);
    });
  });

  describe('createTaskAndReturnID()', function() {

    beforeEach(() => store.reset());

    it('should create one task and return its id', function(done) {
      store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => {
          expect(taskid).to.not.be.null;
          done();
        })
        .catch(done);
    });
  });

  describe('getTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should return the task', function(done) {
      store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => store.getTaskByID(taskid))
        .then((task) => {
          expect(task.text).to.be.equal('test');
          done();
        })
        .catch(done);
    });
  });

  describe('deleteTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should delete the task with taskid', function(done) {
      store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => store.deleteTaskByID(taskid))
        .then(() => store.getAllTasks())
        .then((tasks) => {
          expect(tasks.length).to.be.equal(0);
          done();
        })
        .catch(done);
    });
  });

  describe('modifyTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should modify a task with the taskid', function(done) {
      store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => {
          return store.modifyTaskByID(taskid, {checked: true}).then(() => Promise.resolve(taskid));
        })
        .then((taskid) => store.getTaskByID(taskid))
        .then((task) => {
          expect(task.checked).to.be.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe('getAllGroups()', function() {

    beforeEach(() => store.reset());

    it('should return empty array by default', function(done) {
      store.getAllGroups()
        .then((groups) => {
          expect(groups.length).to.be.equal(0);
          done();
        })
        .catch(done);
    });

    it('should return all groups', function(done) {
      store.createGroupAndReturn({name: 'group1'})
        .then(() => store.createGroupAndReturn({text: 'group2'}))
        .then(() => store.getAllGroups())
        .then((groups) => {
          expect(groups.length).to.be.equal(2);
          done();
        })
        .catch(done);
    });
  });

  describe('createGroupAndReturn()', function() {

    beforeEach(() => store.reset());

    it('should create one group in the store and return it', function(done) {
      store.createGroupAndReturn('group')
        .then((name) => {
          expect(name).to.be.equal('group');
          done();
        })
        .catch(done);
    });
  });

  describe('getGroup()', function() {

    beforeEach(() => store.reset());

    it('should return the group', function(done) {
      store.createGroupAndReturn('group')
        .then((groupname) => store.getGroup(groupname))
        .then((thegroup) => {
          expect(thegroup.name).to.be.equal('group');
          done();
        })
        .catch(done);
    });
  });

  describe('deleteGroup()', function() {

    beforeEach(() => store.reset());

    it('should delete the group, but the tasks should stay', function(done) {
      store.createGroupAndReturn('group')
        .then(() => store.createTaskAndReturnID({text: 'test1'}))
        .then(() => store.createTaskAndReturnID({text: 'test2'}))
        .then((taskid) => store.attachTaskToGroup('group', taskid).then(() => Promise.resolve(taskid)))
        .then((taskid) => store.getTaskByID(taskid))
        .then((task) => {
          expect(task.groups.includes('group'))
        })
        .then(() => store.getAllGroups())
        .then((groups) => {
          expect(groups.length).to.be.equal(1);
        })
        .then(() => store.getAllTasks())
        .then((tasks) => {
          expect(tasks.length).to.be.equal(2);
          done();
        })
        .catch(done);
    });
  });

});

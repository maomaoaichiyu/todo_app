'use strict';
let chai = require('chai');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();
let store = require('../mongoStore');

describe('MongoDB Store', function() {

  before(() => store.init('mongodb://localhost:27017', 'todo'));

  after(() => store.close());

  describe('getAllTasks()', function() {

    beforeEach(() => store.reset());

    it('should return empty array by default', function() {
      return store.getAllTasks()
        .then((tasks) => tasks.length)
        .should.eventually.equal(0);
    });

    it('should return all tasks', function() {
      return store.createTaskAndReturnID({text: 'test1'})
        .then(() => store.createTaskAndReturnID({text: 'test2'}))
        .then(() => store.getAllTasks())
        .then((tasks) => tasks.length)
        .should.eventually.equal(2);
    });
  });

  describe('createTaskAndReturnID()', function() {

    beforeEach(() => store.reset());

    it('should create one task and return its id', function() {
      return store.createTaskAndReturnID({text: 'test'})
        .should.eventually.not.be.null;
    });
  });

  describe('getTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should return the task', function() {
      return store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => store.getTaskByID(taskid))
        .then((task) => task.text)
        .should.eventually.equal('test');
    });
  });

  describe('deleteTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should delete the task with taskid', function() {
      return store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => store.deleteTaskByID(taskid))
        .then(() => store.getAllTasks())
        .then((tasks) => tasks.length)
        .should.eventually.equal(0);
    });
  });

  describe('modifyTaskByID()', function() {

    beforeEach(() => store.reset());

    it('should modify a task with the taskid', function() {
      return store.createTaskAndReturnID({text: 'test'})
        .then((taskid) => {
          return store.modifyTaskByID(taskid, {checked: true})
            .then(() => Promise.resolve(taskid));
        })
        .then((taskid) => store.getTaskByID(taskid))
        .should.eventually.have.property('checked', true);
    });
  });

  describe('getAllGroups()', function() {

    beforeEach(() => store.reset());

    it('should return empty array by default', function() {
      return store.getAllGroups()
        .then((groups) => groups.length)
        .should.eventually.equal(0);
    });

    it('should return all groups', function() {
      return store.createGroupAndReturn({name: 'group1'})
        .then(() => store.createGroupAndReturn({text: 'group2'}))
        .then(() => store.getAllGroups())
        .then((groups) => groups.length)
        .should.eventually.equal(2);
    });
  });

  describe('createGroupAndReturn()', function() {

    beforeEach(() => store.reset());

    it('should create one group in the store and return it', function() {
      return store.createGroupAndReturn('group')
        .should.eventually.equal('group');
    });
  });

  describe('getGroup()', function() {

    beforeEach(() => store.reset());

    it('should return the group', function() {
      return store.createGroupAndReturn('group')
        .then((groupname) => store.getGroup(groupname))
        .should.eventually.have.property('name', 'group');
    });
  });

  describe('deleteGroup()', function() {

    beforeEach(() => store.reset());

    it('should delete the group, but the tasks should stay', function() {
      let startPromise = store.createGroupAndReturn('group')
        .then(() => store.createTaskAndReturnID({text: 'test1'}))
        .then(() => store.createTaskAndReturnID({text: 'test2'}))
        .then((taskid) => store.attachTaskToGroup('group', taskid)
          .then(() => Promise.resolve(taskid)))
        .then((taskid) => store.getTaskByID(taskid));

      let theTasksGroups = startPromise
        .then((task) => task.groups);

      let theGroupsLength = startPromise
        .then(() => store.getAllGroups())
        .then((groups) => groups.length);

      let theTasksLength = startPromise
        .then(() => store.getAllTasks())
        .then((tasks) => tasks.length);

      return Promise.all([
        theTasksGroups.should.eventually.have.members(['group'],
          'group not found on task'),
        theGroupsLength.should.eventually.equal(1, 'wrong amount of groups'),
        theTasksLength.should.eventually.equal(2, 'wrong amount of tasks'),
      ]);
    });
  });

});

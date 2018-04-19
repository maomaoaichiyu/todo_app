'use strict';
let uuid = require('uuid/v4');

let tasks = {};
let groups = [];
module.exports = {
  init: function() {
    return Promise.resolve();
  },
  reset: function() {
    tasks = {};
    groups = [];
    return Promise.resolve();
  },
  close: function() {
    return Promise.resolve();
  },
  getAllTasks: function(group) {
    let tasks_array = [];
    if (!group) {
      Object.keys(tasks).forEach(taskID => {
        tasks_array.push({id: taskID, task: tasks[taskID]});
      });
    } else {
      Object.keys(tasks).forEach(taskID => {
        if (tasks[taskID]['groups'].includes(group)) {
          tasks_array.push({id: taskID, task: tasks[taskID]});
        }
      });
    }
    return Promise.resolve(tasks_array);
  },
  createTaskAndReturnID: function(task) {
    let task_id = uuid();
    tasks[task_id] = task;
    task['groups'] = [];
    return Promise.resolve(task_id);
  },
  getTaskByID: function(taskID) {
    return Promise.resolve(tasks[taskID]);
  },
  deleteTaskByID: function(taskID) {
    delete tasks[taskID];
    return Promise.resolve();
  },
  modifyTaskByID: function(taskID, new_content) {
    tasks[taskID] = Object.assign(tasks[taskID], new_content);
    return Promise.resolve();
  },
  getAllGroups: function() {
    return Promise.resolve(groups);
  },
  createGroupAndReturn: function(group) {
    if (!groups.includes(group)) {
      groups.push(group);
    }
    return Promise.resolve(group);
  },
  getGroup: function(group) {
    return Promise.resolve(groups.includes(group) ? {name: group} : '');
  },
  deleteGroup: function(group) {
    Object.keys(tasks).forEach(taskID => {
      tasks[taskID]['groups'] = tasks[taskID]['groups']
        .filter(e => e !== group);
    });
    groups = groups.filter(e => e !== group);
    return Promise.resolve();
  },
  attachTaskToGroup: function(group, taskID) {
    tasks[taskID]['groups'].push(group);
    return Promise.resolve();
  },
};

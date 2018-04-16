'use strict';
let uuid = require('uuid/v4');

let tasks = {};
module.exports = {
  getAll: function() {
    let tasks_array = [];
    Object.keys(tasks).forEach(function(taskID) {
      tasks_array.push({id: taskID, task: tasks[taskID]});
    });
    return tasks_array;
  },
  createTaskAndReturnID: function(task) {
    let task_id = uuid();
    tasks[task_id] = task;
    return task_id;
  },
  getTaskByID: function(taskID) {
    return tasks[taskID];
  },
  deleteTaskByID: function(taskID) {
    delete tasks[taskID];
  },
  modifyTaskByID: function(taskID, new_content) {
    tasks[taskID] = Object.assign(tasks[taskID], new_content);
  },
};

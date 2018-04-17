'use strict';
let uuid = require('uuid/v4');

let tasks = {};
let groups = [];
module.exports = {
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
    return tasks_array;
  },
  createTaskAndReturnID: function(task) {
    let task_id = uuid();
    tasks[task_id] = task;
    task['groups'] = [];
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
  getAllGroups: function() {
    return groups;
  },
  createGroupAndReturn: function(group) {
    if (!groups.includes(group)) {
      groups.push(group);
    }
    return group;
  },
  getGroup: function(group) {
    return groups.includes(group) ? group : '';
  },
  deleteGroup: function(group) {
    Object.keys(tasks).forEach(taskID => {
      tasks[taskID]['groups'] = tasks[taskID]['groups']
        .filter(e => e !== group);
    });
    groups = groups.filter(e => e !== group);
  },
  attachTaskToGroup: function(group, taskID) {
    tasks[taskID]['groups'].push(group);
  },
};

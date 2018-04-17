'use strict';
let uuid = require('uuid/v4');

let tasks = {};
let labels = {};
module.exports = {
  getAllTasks: function() {
    let tasks_array = [];
    Object.keys(tasks).forEach(taskID => {
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
  getAllLabels: function() {
    let labels_array = [];
    Object.keys(labels).forEach(labelID => {
      labels_array.push({id: labelID, label: labels[labelID]});
    });
    return labels_array;
  },
  createLabelAndReturnID: function(label) {
    let label_id = uuid();
    labels[label_id] = label;
    return label_id;
  },
  getLabelByID: function(labelID) {
    return labels[labelID];
  },
  deleteLabelByID: function(labelID) {
    delete labels[labelID];
  },
  modifyLabelByID: function(labelID, new_content) {
    tasks[labelID] = Object.assign(labels[labelID], new_content);
  },
};

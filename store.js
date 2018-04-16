let uuid = require('uuid/v4');

let tasks = {}

module.exports = {
  getAll: function () {
    return JSON.stringify(tasks)
  },
  createTaskAndReturnID: function (task) {
    let task_id = uuid()
    tasks[task_id] = task
    return task_id
  },
  getTaskByID: function (taskID) {
    return JSON.stringify(tasks[taskID])
  },
  deleteTaskByID: function (taskID) {
    delete tasks[taskID]
  },
  modifyTaskByID: function (taskID, new_content) {
    tasks[taskID] = Object.assign(tasks[taskID], new_content)
  }
}
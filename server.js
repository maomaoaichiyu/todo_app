'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let store = require('./store');
let app = express();

let jsonParser = bodyParser.json();

// api endpoint tasks
app.get('/tasks', function(req, res) {
  console.log('Got a GET request for the tasks page');
  let groupFilter = req.query.group;
  res.json(store.getAllTasks(groupFilter));
});

app.post('/tasks', jsonParser, function(req, res) {
  console.log('Got a POST request for the tasks page');
  let task_id = store.createTaskAndReturnID(req.body);
  res.send(task_id);
});

app.get('/tasks/:taskID', function(req, res) {
  console.log('Got a GET request for a task with taskID');
  res.json(store.getTaskByID(req.params.taskID));
});

app.delete('/tasks/:taskID', function(req, res) {
  console.log('Got a DELETE request for tasks page with taskID');
  store.deleteTaskByID(req.params.taskID);
  res.send(`deleted task with ID ${req.params.taskID}`);
});

app.patch('/tasks/:taskID', jsonParser, function(req, res) {
  console.log('Got a PATCH request for tasks page with taskID');
  store.modifyTaskByID(req.params.taskID, req.body);
  res.send(`modify task with ID ${req.params.taskID}`);
});

// api endpoint groups
app.get('/groups', function(req, res) {
  console.log('Got a GET request for the groups');
  res.json(store.getAllGroups());
});

app.post('/groups', jsonParser, function(req, res) {
  console.log('Got a POST request for the groups');
  let group = store.createGroupAndReturn(req.body.name);
  res.send(group);
});

app.get('/groups/:group', function(req, res) {
  console.log('Got a GET request for a group');
  res.json(store.getGroup(req.params.group));
});

app.delete('/groups/:group', function(req, res) {
  console.log('Got a DELETE request for a group');
  store.deleteGroup(req.params.group);
  res.send(`deleted group ${req.params.group}`);
});

app.put('/groups/:group/:taskID', function(req, res) {
  console.log('Got a PUT request for task in group');
  store.attachTaskToGroup(req.params.group, req.params.taskID);
  // eslint-disable-next-line max-len
  res.send(`added task with ID ${req.params.taskID} to group ${req.params.group}`);
});


let server = app.listen(8081, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Todo app listening at http://${host}:${port}`);
});

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
  if (!req.body.text) {
    res.status(400).send('missing field text');
    return;
  }
  let task_id = store.createTaskAndReturnID(req.body);
  res.status(201).send(task_id);
});

app.get('/tasks/:taskID', function(req, res) {
  console.log('Got a GET request for a task with taskID');
  let task = store.getTaskByID(req.params.taskID);
  if (!task) {
    res.status(404).send('task not found');
    return;
  }
  res.json(task);
});

app.delete('/tasks/:taskID', function(req, res) {
  console.log('Got a DELETE request for tasks page with taskID');
  let task = store.getTaskByID(req.params.taskID);
  if (!task) {
    res.status(404).send('task not found');
    return;
  }
  store.deleteTaskByID(req.params.taskID);
  res.send(`deleted task with ID ${req.params.taskID}`);
});

app.patch('/tasks/:taskID', jsonParser, function(req, res) {
  console.log('Got a PATCH request for tasks page with taskID');
  let task = store.getTaskByID(req.params.taskID);
  if (!task) {
    res.status(404).send('task not found');
    return;
  }
  if (Object.keys(req.body)
    .filter(e => e !== 'text' && e !== 'checked').length > 0) {
    res.status(400)
      .send('the only properties allowed are "text" and "checked"');
    return;
  }
  if (Object.keys(req.body).includes('checked')
    && typeof req.body.checked !== 'boolean') {
    res.status(400).send('checked must be a boolean');
    return;
  }
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
  if (!req.body.name) {
    res.status(400).send('missing field name');
    return;
  }
  let group = store.createGroupAndReturn(req.body.name);
  res.send(group);
});

app.get('/groups/:group', function(req, res) {
  console.log('Got a GET request for a group');
  let group = store.getGroup(req.params.group);
  if (!group) {
    res.status(404).send('group not found');
    return;
  }
  res.json(group);
});

app.delete('/groups/:group', function(req, res) {
  console.log('Got a DELETE request for a group');
  let group = store.getGroup(req.params.group);
  if (!group) {
    res.status(404).send('group not found');
    return;
  }
  store.deleteGroup(req.params.group);
  res.send(`deleted group ${req.params.group}`);
});

app.put('/groups/:group/:taskID', function(req, res) {
  console.log('Got a PUT request for task in group');
  let group = store.getGroup(req.params.group);
  if (!group) {
    res.status(404).send('group not found');
    return;
  }
  let task = store.getTaskByID(req.params.taskID);
  if (!task) {
    res.status(404).send('task not found');
    return;
  }
  store.attachTaskToGroup(req.params.group, req.params.taskID);
  // eslint-disable-next-line max-len
  res.send(`added task with ID ${req.params.taskID} to group ${req.params.group}`);
});


let server = app.listen(8081, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Todo app listening at http://${host}:${port}`);
});

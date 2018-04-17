'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let store = require('./store');
let app = express();

let jsonParser = bodyParser.json();

// api endpoint tasks
app.get('/tasks', function(req, res) {
  console.log('Got a GET request for the tasks page');
  res.send(JSON.stringify(store.getAllTasks()));
});

app.post('/tasks', jsonParser, function(req, res) {
  console.log('Got a POST request for the tasks page');
  let task_id = store.createTaskAndReturnID(req.body);
  res.send(task_id);
});

app.get('/tasks/:taskID', function(req, res) {
  console.log('Got a GET request for a task with taskID');
  res.send(JSON.stringify(store.getTaskByID(req.params.taskID)));
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

// api endpoint labels
app.get('/labels', function(req, res) {
  console.log('Got a GET request for the labels');
  res.send(JSON.stringify(store.getAllLabels()));
});

app.post('/labels', jsonParser, function(req, res) {
  console.log('Got a POST request for the labels');
  let label_id = store.createLabelAndReturnID(req.body);
  res.send(label_id);
});

app.get('/labels/:labelID', function(req, res) {
  console.log('Got a GET request for a label with labelID');
  res.send(JSON.stringify(store.getLabelByID(req.params.labelID)));
});

app.delete('/labels/:labelID', function(req, res) {
  console.log('Got a DELETE request for labels with labelID');
  store.deleteLabelByID(req.params.labelID);
  res.send(`deleted label with ID ${req.params.labelID}`);
});

app.patch('/labels/:labelID', jsonParser, function(req, res) {
  console.log('Got a PATCH request for labels with labelID');
  store.modifyLabelByID(req.params.labelID, req.body);
  res.send(`modify label with ID ${req.params.labelID}`);
});

let server = app.listen(8081, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Todo app listening at http://${host}:${port}`);
});

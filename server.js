let express = require('express');
let bodyParser = require('body-parser');
let uuid = require('uuid/v4');
let app = express();

let jsonParser = bodyParser.json();

let tasks = {};

app.get('/tasks', function (req, res) {
  console.log("Got a GET request for the tasks page");
  res.send(JSON.stringify(tasks));
})

app.post('/tasks', jsonParser, function (req, res) {
  console.log("Got a POST request for the tasks page");
  let task_id = uuid();
  tasks[task_id]=req.body;
  res.send(task_id);
})

app.get('/tasks/:taskID', function (req, res) {
  console.log("Got a GET request for a task with taskID");
  res.send(JSON.stringify(tasks[req.params.taskID]));
})

app.delete('/tasks/:taskID', function (req, res) {
  console.log("Got a DELETE request for tasks page with taskID");
  delete tasks[req.params.taskID];
  res.send(`deleted task with ID ${req.params.taskID}`);
})

app.patch('/tasks/:taskID', jsonParser, function (req, res) {
  console.log("Got a PATCH request for tasks page with taskID");
  tasks[req.params.taskID] = Object.assign(tasks[req.params.taskID], req.body);
  res.send(`modify task with ID ${req.params.taskID}`);
})

let server = app.listen(8081, function () {
  let host = server.address().address
  let port = server.address().port
   
  console.log(`Todo app listening at http://${host}:${port}`)
})
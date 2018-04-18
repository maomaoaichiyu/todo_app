'use strict';
let express = require('express');
let bodyParser = require('body-parser');
let store = require('./mongoStore');
let app = express();

let jsonParser = bodyParser.json();

// api endpoint tasks
app.get('/tasks', function(req, res) {
  console.log('Got a GET request for the tasks page');
  let groupFilter = req.query.group;
  store.getAllTasks(groupFilter)
    .then((tasks) => res.json(tasks));
});

app.post('/tasks', jsonParser, function(req, res) {
  console.log('Got a POST request for the tasks page');
  if (!req.body.text) {
    res.status(400).send('missing field text');
    return;
  }
  store.createTaskAndReturnID(req.body)
    .then((task_id) => res.status(201).send(task_id));
});

app.get('/tasks/:taskID', function(req, res) {
  console.log('Got a GET request for a task with taskID');
  store.getTaskByID(req.params.taskID)
    .then((task) => {
      if (!task) {
        res.status(404).send('task not found');
        return;
      }
      res.json(task);
    })
});

app.delete('/tasks/:taskID', function(req, res) {
  console.log('Got a DELETE request for tasks page with taskID');
  store.getTaskByID(req.params.taskID)
  .then((task) => {
    if (!task) {
      res.status(404).send('task not found');
      Promise.reject();
    }
  })
  .then(() => store.deleteTaskByID(req.params.taskID))
  .then(() => res.send(`deleted task with ID ${req.params.taskID}`));
});

app.patch('/tasks/:taskID', jsonParser, function(req, res) {
  console.log('Got a PATCH request for tasks page with taskID');
  store.getTaskByID(req.params.taskID)
    .then((task) => {
      if (!task) {
        res.status(404).send('task not found');
        Promise.reject();
      }
      return task;
  })
  .then((task) => {
    if (Object.keys(req.body)
      .filter(e => e !== 'text' && e !== 'checked').length > 0) {
      res.status(400)
        .send('the only properties allowed are "text" and "checked"');
     Promise.reject();
     return;
    }
    if (Object.keys(req.body).includes('checked')
      && typeof req.body.checked !== 'boolean') {
      res.status(400).send('checked must be a boolean');
    Promise.reject();
      return;
    }
    return task;
  })
  .then((task) => store.modifyTaskByID(req.params.taskID, req.body))
  .then(() => res.send(`modify task with ID ${req.params.taskID}`));
});

// api endpoint groups
app.get('/groups', function(req, res) {
  console.log('Got a GET request for the groups');
  store.getAllGroups()
    .then((groups) => res.json(groups));
});

app.post('/groups', jsonParser, function(req, res) {
  console.log('Got a POST request for the groups');
  if (!req.body.name) {
    res.status(400).send('missing field name');
    return;
  }
  store.createGroupAndReturn(req.body.name)
    .then((group) => res.send(group));
});

app.get('/groups/:group', function(req, res) {
  console.log('Got a GET request for a group');
  store.getGroup(req.params.group)
    .then((group) => {
      if (!group) {
        res.status(404).send('group not found');
        return;
      }
      res.json(task);
    });
});

app.delete('/groups/:group', function(req, res) {
  console.log('Got a DELETE request for a group');
  store.getGroup(req.params.group)
  .then((group) => {
    if (!group) {
      res.status(404).send('group not found');
      Promise.reject();
    }
  })
  .then(() => store.deleteGroup(req.params.group))
  .then(() => res.send(`deleted group ${req.params.group}`));
});

app.put('/groups/:group/:taskID', function(req, res) {
  console.log('Got a PUT request for task in group');
  let groupName = req.params.group;
  store.getGroup(groupName)
  .then((group) => {
    if (!group) {
      res.status(404).send('group not found');
      Promise.reject();
    }
  })
  .then(() => store.getTaskByID(req.params.taskID))
  .then((task) => {
    if (!task) {
      res.status(404).send('task not found');
      Promise.reject();
    }
    return task;
  })
  .then((task) => store.attachTaskToGroup(req.params.group, req.params.taskID))
  // eslint-disable-next-line max-len
  .then(() => res.send(`added task with ID ${req.params.taskID} to group ${req.params.group}`));
});

app.use(function(req, res, next) {
  res.status(404).send();
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Internal server error')
});

let server = app.listen(8081, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Todo app listening at http://${host}:${port}`);
});

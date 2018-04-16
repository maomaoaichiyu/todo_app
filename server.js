let express = require('express');
let bodyParser = require('body-parser');
let app = express();

let jsonParser = bodyParser.json();

app.get('/tasks', function (req, res) {
  console.log("Got a GET request for the tasks page");
  res.send('Hello GET');
})

app.post('/tasks', jsonParser, function (req, res) {
  console.log("Got a POST request for the tasks page");
  res.send(`post task ${JSON.stringify(req.body)}`);
})

app.delete('/tasks/:taskID', function (req, res) {
  console.log("Got a DELETE request for tasks page with taskID");
  res.send(`delele task with ID ${req.params.taskID}`);
})

app.patch('/tasks/:taskID', jsonParser, function (req, res) {
  console.log("Got a PATCH request for tasks page with taskID");
  res.send(`modify task with ID ${req.params.taskID}`);
})

let server = app.listen(8081, function () {
  let host = server.address().address
  let port = server.address().port
   
  console.log(`Todo app listening at http://${host}:${port}`)
})
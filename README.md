[![Build Status](https://travis-ci.org/maomaoaichiyu/todo_app.svg?branch=master)](https://travis-ci.org/maomaoaichiyu/todo_app)

# To-Do App

This repository contains a simple Node.js application that can store tasks and group them. The data is stored in MongoDB. Inside 'extras' is possible to find a postman collection to interact with the server.

## Build Setup

``` bash
# install dependencies
npm install

# start server
npm start

# run tests
npm test
```

The server is hosted here: [https://young-journey-45325.herokuapp.com](https://young-journey-45325.herokuapp.com)

## Endpoints

### tasks

#### GET
Returns an array of tasks. Can be used with a query parameter "group" to filter the results, or without to get all of them.

#### POST
Creates a task, expects an object containing a field "text" as body. Returns the newly created object ID

### tasks/{TASK_ID}

#### GET
Retrieves the task with specified ID

#### DELETE
Deletes the task with specified ID

#### PATCH
Edits the task with specified ID. Expects an object containing either a field "text" or a field "checked"

### groups

#### GET
Returns an array of groups

#### POST
Creates a group, expects an object containing a field "name" as body. Returns the newly created object name

### groups/{GROUP_NAME}

#### GET
Retrieves the group with specified name

#### DELETE
Deletes the group with specified name

### groups/{GROUP_NAME}/{TASK_ID}

#### PUT
Adds the specified task to the group
'use strict';
let mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let databaseConnection;
let db;

let TASKS = 'tasks';
let GROUPS = 'groups;';

module.exports = {
  init: function(connectionString, databaseName) {
    return mongoClient.connect(connectionString)
      .then((connection) => {
        console.log('Connected to MongoDB!');
        databaseConnection = connection;
        db = connection.db(databaseName);
      })
      .then(() => db.createCollection(TASKS))
      .then(() => console.log('Tasks collection created!'))
      .then(() => db.createCollection(GROUPS))
      .then(() => console.log('Groups collection created!'));
  },
  reset: function() {
    return db.collection(TASKS).remove()
      .then(() => db.collection(GROUPS).remove());
  },
  close: function() {
    return databaseConnection.close()
      .then(() => {
        databaseConnection = undefined;
        return;
      });
  },
  getAllTasks: function(group) {
    let query = group ? {groups: group} : {};
    return db.collection(TASKS).find(query).toArray();
  },
  createTaskAndReturnID: function(task) {
    task['groups'] = [];
    return db.collection(TASKS).insertOne(task).then((res) => res.insertedId);
  },
  getTaskByID: function(taskID) {
    return db.collection(TASKS).findOne({_id: new mongo.ObjectID(taskID)});
  },
  deleteTaskByID: function(taskID) {
    return db.collection(TASKS).deleteOne({_id: new mongo.ObjectID(taskID)});
  },
  modifyTaskByID: function(taskID, new_content) {
    let newvalues = { $set: new_content };
    return db.collection(TASKS)
      .updateOne({_id: new mongo.ObjectID(taskID)}, newvalues);
  },
  getAllGroups: function() {
    return db.collection(GROUPS).find().toArray();
  },
  createGroupAndReturn: function(groupName) {
    return db.collection(GROUPS).findOne({name: groupName})
      .then((group) => {
        if (group) {
          return Promise.resolve(groupName);
        }
        return db.collection(GROUPS).insertOne({name: groupName})
          .then(() => Promise.resolve(groupName));
      });
  },
  getGroup: function(groupName) {
    return db.collection(GROUPS).findOne({name: groupName});
  },
  deleteGroup: function(groupName) {
    return db.collection(GROUPS).deleteOne({name: groupName})
      .then(() => db.collection(TASKS)
        .update({ groups: groupName }, { $pull: { groups: groupName } }));
  },
  attachTaskToGroup: function(group, taskID) {
    let newvalues = { $push: {groups: group} };
    return db.collection(TASKS)
      .updateOne({_id: new mongo.ObjectID(taskID)}, newvalues);
  },
};

'use strict';
var mongo = require('mongodb');
let mongoClient = mongo.MongoClient;
let db;

let CONNECTION_STRING = process.env.MONGODB_URI || 'mongodb://localhost:27017';
let DATABASE_NAME = process.env.DB_NAME || 'todo';
let TASKS = 'tasks';
let GROUPS = 'groups;';

mongoClient.connect(CONNECTION_STRING, function(err, database) {
  if (err) throw err;
  console.log('Database created!');
  db = database.db(DATABASE_NAME);
  db.createCollection(TASKS, function(err, res) {
    if (err) throw err;
    console.log('Tasks collection created!');
  });
  db.createCollection(GROUPS, function(err, res) {
    if (err) throw err;
    console.log('Groups collection created!');
  });
});

module.exports = {
  getAllTasks: function(group) {
    // db.collection(TASKS).drop();
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
          return groupName;
        }
        return db.collection(GROUPS).insertOne({name: groupName})
          .then(() => groupName);
      });
  },
  getGroup: function(groupName) {
    return db.collection(GROUPS).findOne({name: groupName});
  },
  deleteGroup: function(groupName) {
    return db.collection(GROUPS).deleteOne({name: groupName})
      .then(() => db.collection(TASKS)
        .update({}, { $pull: { groups: groupName } }));
  },
  attachTaskToGroup: function(group, taskID) {
    let newvalues = { $push: {groups: group} };
    return db.collection(TASKS)
      .updateOne({_id: new mongo.ObjectID(taskID)}, newvalues);
  },
};

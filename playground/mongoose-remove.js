const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then ((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove
// Todo.findByIDAndRemove

Todo.findOneAndRemove({_id: '5b15cd8b3d1134778b3f4f29'}).then((todo) => {
    console.log(todo);
});

Todo.findByIdAndRemove('5b15cd8b3d1134778b3f4f29').then((todo) => {
    console.log(todo);
});
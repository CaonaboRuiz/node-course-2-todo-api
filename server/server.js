const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Basic CRUD
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }

    Todo.findById(id).then((todo) => {
        if(!todo) {
            return res.status(404).send('Todo not found');
        }

        res.send({todo});
    }).catch((e) => res.status(400).send('catch bad request'));
});

app.delete('/todos/:id', (req, res) => {
    // get the id
    var id = req.params.id;
    // validate the id -> not valid: return 404
    if(!ObjectID.isValid(id)) {
        return res.status(404).send('ID not valid');
    }
    // remove todo by id
    Todo.findByIdAndRemove(id).then((todo) => {
        // sucess
        // if no doc, send 404
        if(!todo) {
            return res.status(404).send('Todo not found');
        }
        // if doc, send doc back with 200
        res.status(200).send({todo});
    // error 400 with empty body
    }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // create a subset from body, with property we want to change only
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    // update completedAt property based on the completed property passed to us
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();  // Unix Epic - Millis from 1/1/1970
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    // find by id and update the two properties
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports =  {app};
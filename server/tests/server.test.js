// to execute package.json test-watch script do as follows:
// npm run test-watch

const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

// Lifecycle testing due to asumption 1 record only => expect(todos.length).toBe(1);
beforeEach((done) => {
    // Todo.remove({}).then(() => done());
    Todo.remove({}).then(() => {
        // return Todo.insertMany(todos);
        Todo.insertMany(todos);
    }).then(() => done());
}); 

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);  // expect only 1 todo in db
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
    
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);  // expect only 2 todo in db
                done();
            }).catch((e) => done(e));
        });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect((res) => {
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`todos/123`)
        .expect(404)
        .expect((res) => {
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });

});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toBe(null); // .toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
        .delete(`/tdos/${hexId}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
        .delete(`todos/123`)
        .expect(404)
        .expect((res) => {
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });

});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        // grab id of first item
        var hexId = todos[0]._id.toHexString();

        // update text, set completed true
        var body = _.pick(todos[0].body, ['text', 'completed']);
        body.completed = true;
        body.text = 'updated by PATCH';
        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)

        // assertion 200
        .expect(200)
        .expect((res) => {
            // text is changed, completed is true, completeAt is a number, toBeA
            expect(res.body.todo.text).toBe(body.text)
            expect(res.body.todo.completed).toBe(body.completed)
            expect(res.body.todo.completedAt).toBeGreaterThan(0); //toBeA('number');
        })
        .end(done);
    });

    it('should clear completeAt when todo is not completed', (done) => {
        // grab id of second todo item
        var hexId = todos[1]._id.toHexString();

        // update text, set completed to false
        var body = _.pick(todos[1].body, ['text', 'completed']);
        body.completed = false;
        body.text = 'updated by PATCH';
        request(app)
        .patch(`/todos/${hexId}`)
        .send(body)

        // assertion 200
        .expect(200)
        .expect((res) => {
            // text is changed, completed false, completedAt is null, toNotExist
            expect(res.body.todo.text).toBe(body.text)
            expect(res.body.todo.completed).toBe(body.completed)
            expect(res.body.todo.completedAt).toBe(null); // .toNotExist();
        })
        .end(done);
    });
});
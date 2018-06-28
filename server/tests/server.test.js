// to execute package.json test-watch script do as follows:
// npm run test-watch

const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// Lifecycle testing due to asumption 1 record only => expect(todos.length).toBe(1);
// beforeEach(populateUsers);
// beforeEach(populateTodos);
beforeEach(() => populateUsers());
beforeEach(() => populateTodos());


// describe('POST /todos', () => {
//     it('should create a new todo', (done) => {
//         var text = 'Test todo text';

//         request(app)
//         .post('/todos')
//         .send({text})
//         .expect(200)
//         .expect((res) => {
//             expect(res.body.text).toBe(text);
//         })
//         .end((err, res) => {
//             if (err) {
//                 return done(err);
//             }

//             Todo.find({text}).then((todos) => {
//                 expect(todos.length).toBe(1); 
//                 expect(todos[0].text).toBe(text);
//                 done();
//             }).catch((e) => done(e));
//         });
//         done();
//     });

//     it('should not create todo with invalid body data', (done) => {
//         request(app)
//         .post('/todos')
//         .send({})
//         .expect(400)
//         .end((err, res) => {
//             if (err) {
//                 return done(err);
//             }
    
//             Todo.find().then((todos) => {
//                 expect(todos.length).toBe(2);  // expect only 2 todo in db
//                 // done();
//             }).catch((e) => done(e));
//         });
//         done();
//     });
// });

// describe('GET /todos', () => {
//     it('should get all todos', (done) => {
//         request(app)
//             .get('/todos')
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.todos.length).toBe(2);
//             });
//             // .end(done);
//             done();
//     });
// });

// describe('GET /todos/:id', () => {
//     it('should return todo doc', (done) => {
//         request(app)
//         .get(`/todos/${todos[0]._id.toHexString()}`)
//         .expect(200)
//         .expect((res) => {
//             expect(res.body.todo.text).toBe(todos[0].text);
//         });
//         // .end(done);
//         done();
//     });

//     it('should return 404 if todo not found', (done) => {
//         request(app)
//         .get(`/todos/${new ObjectID().toHexString()}`)
//         .expect(404)
//         .expect((res) => {
//             expect(res.body.todo).toBe(undefined);
//         })
//         .end(done);
//         done();
//     });

//     it('should return 404 for non-object ids', (done) => {
//         request(app)
//         .get(`todos/123`)
//         .expect(404)
//         .expect((res) => {
//             expect(res.body.todo).toBe(undefined);
//         })
//         .end(done);
//     });
// });

// describe('DELETE /todos/:id', () => {
//     it('should remove a todo', (done) => {
//         var hexId = todos[1]._id.toHexString();

//         request(app)
//         .delete(`/todos/${hexId}`)
//         .expect(200)
//         .expect((res) => {
//             expect(res.body.todo._id).toBe(hexId);
//         })
//         .end((err, res) => {
//             if (err) {
//                 return done(err);
//             }

//             Todo.findById(hexId).then((todo) => {
//                 expect(todo).toBe(null); // .toNotExist();
//                 // done();
//             }).catch((e) => done(e));
//         });
//         done();
//     });

//     it('should return 404 if todo not found', (done) => {
//         var hexId = new ObjectID().toHexString();

//         request(app)
//         .delete(`/tdos/${hexId}`)
//         .expect(404)
//         .end(done);
//     });

//     it('should return 404 if object id is invalid', (done) => {
//         request(app)
//         .delete(`todos/123`)
//         .expect(404)
//         .expect((res) => {
//             expect(res.body.todo).toBe(undefined);
//         })
//         .end(done);
//     });

// });

// describe('PATCH /todos/:id', () => {
//     it('should update the todo', (done) => {
//         // grab id of first item
//         var hexId = todos[0]._id.toHexString();

//         // update text, set completed true
//         var body = _.pick(todos[0].body, ['text', 'completed']);
//         body.completed = true;
//         body.text = 'updated by PATCH';
//         request(app)
//         .patch(`/todos/${hexId}`)
//         .send(body)

//         // assertion 200
//         .expect(200)
//         .expect((res) => {
//             // text is changed, completed is true, completeAt is a number, toBeA
//             expect(res.body.todo.text).toBe(body.text)
//             expect(res.body.todo.completed).toBe(body.completed)
//             expect(res.body.todo.completedAt).toBeGreaterThan(0); //toBeA('number');
//         })
//         .end(done);
//         done();
//     });

//     it('should clear completeAt when todo is not completed', (done) => {
//         // grab id of second todo item
//         var hexId = todos[1]._id.toHexString();

//         // update text, set completed to false
//         var body = _.pick(todos[1].body, ['text', 'completed']);
//         body.completed = false;
//         body.text = 'updated by PATCH';
//         request(app)
//         .patch(`/todos/${hexId}`)
//         .send(body)

//         // assertion 200
//         .expect(200)
//         .expect((res) => {
//             // text is changed, completed false, completedAt is null, toNotExist
//             expect(res.body.todo.text).toBe(body.text)
//             expect(res.body.todo.completed).toBe(body.completed)
//             expect(res.body.todo.completedAt).toBe(null); // .toNotExist();
//         })
//         .end(done);
//         done();
//     });
// });

// describe('GET /users/me', () => {
//     it('should return user if authenticated', (done) => {
//         request(app)
//         .get('/users/me')
//         .set('x-auth', users[0].tokens[0].token)
//         .expect(200)
//         .expect((res) => {
//             expect(res.body._id).toBe(users[0]._id.toHexString());
//             expect(res.body.email).toBe(users[0].email);
//         })
//         .end(done);
//         done();
//     });
    
//     it('should return 401 if not authenticated', (done) => {
//         request(app)
//         .get('/users/me')
//         .expect(401)
//         .expect((res) => {
//             expect(res.body).toEqual({});
//         })
//         .end(done);
//         // done();
//     });
// });

// describe('POST /users', () => {
//     it('should create a user', (done) => {
//         var email = 'example@example.com';
//         var password = '123mnb!';

//         request(app)
//         .post('/users')
//         .send({email, password})
//         .expect(200)
//         .expect((res) => {
//             expect(res.headers['x-auth']).toExist();
//             expect(res.body._id).toExist();
//             expect(res.body.email).toBe(email);
//         })
//         .end((err) => {
//             if (err) {
//                 return done(err);
//             }

//             User.findOne({email}).then((user) => {
//                 expect(user).toExist();
//                 expect(user.password).toNotBe(password);
//                 done();
//             }).catch((e) => done(e));
//         });
//         done();
//     });

//     it('should return validation erros if request invalid', (done) => {
//         // invalid email and password (400)
//         var email = 'example1@example1.com';
//         var password = '123mnb!1';

//         request(app)
//         .post('/users')
//         .send({email, password})
//         .expect(400)
//         done();
//     });

//     it('should not create user if email in use', (done) => {
//         // use an email that exist (400)
//         var email = 'caonabo@example.com';
//         var password = '123mnb!1';

//         request(app)
//         .post('/users')
//         .send({email, password})
//         .expect(400)
//         done();
//     });
// });

describe('POST /users/login', () => {
    it('should login user and return auth token', () => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });
    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res) => {
            if (err) {
                return done(err);
            }

            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });
        done();
    });
});
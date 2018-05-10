// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');

    // deleteManu
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result);
    // })

    // deleteOne by _id
    // db.collection('Users').deleteOne({
    //     _id: new ObjectID("5af38f462ee24d2d6c6758a2")
    // }).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').deleteMany({name: 'Caonabo Ruiz'}).then((result) => {
        console.log(result);
    });

    client.close();
});
var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined, {
    'dialect': 'sqlite',
    'storage': 'basic-sqlite-database.sqlite'
});


var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

var User = sequelize.define('user', {
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo)

sequelize.sync({
    //force: true
}).then(function() {
    console.log('Everything is synced');

    User.findById(1).then(function(user) {
        user.getTodos({ where: {completed: true} }).then(function(todos) {
            todos.forEach(function(todo) {
                console.log(todo.toJSON());
            });
        });
    });

    // User.create({
    //     email: 'christianpena9@gmail.com'
    // }).then(function() {
    //     return Todo.create({
    //         description: 'Clean the yard.'
    //     });
    // }).then(function(todo) {
    //     User.findById(1).then(function(user) {
    //         user.addTodo(todo);
    //     });
    // });

/*
    return Todo.findById(2).then(function(todo) {
        if(todo) {
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found!');
        }
    });
*/
    // Todo.create({
    //     description: 'Walk my dog',
    //     completed: false
    // }).then(function(todo) {
    //     return Todo.create({
    //         description: 'Clean office'
    //     });
    // }).then(function() {
    //     //return Todo.findById(1);
    //     return Todo.findAll({
    //         where: {
    //             description: {
    //                 $like: '%Office%'
    //             }
    //         }
    //     });
    // }).then(function(todos) {
    //     if(todos) {
    //         todos.forEach(function(todo) {
    //             console.log(todo.toJSON());
    //         });
    //     } else {
    //         console.log('no todo found!');
    //     }
    // }).catch(function(e) {
    //     console.log(e);
    // });
});

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res) {
    var query = req.query; // object for all params in req
    var where = {};

    console.log('query: ' + JSON.stringify(query));

    if(query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if(query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if(query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }

    db.todo.findAll({where: where}).then(function(todos) {
        res.json(todos);
    }, function(e) {
        console.log(e);
        res.status(500).send();
    });
});

/*
Refactored GET /todos/:id
*/
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    //console.log(todoId);
    db.todo.findById(todoId).then(function(todo) {
        if(!!todo) {
            res.json(todo);
        } else {
            console.log('something went wrong!');
            res.status(404).send();
        }
    }, function(e) {
        res.status(500).send();
    });
    // db.todo.findById(todoId).then(function(todo) {
    //     res.status(200);
    // }, function(e) {
    //     res.status(500);
    // });
    // var todoId = parseInt(req.params.id, 10);
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    //
    // if(matchedTodo) {
    //     res.json(matchedTodo); // sends automatically a 200 results
    // } else {
    //     res.status(404).json({"error": "no todo found with that id"});
    // }
});

/*for in loop*/
// GET /todos/:id
/*
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var todo;
    for(todo in todos) {
        if( todos[todo].id === todoId ) {
            //res.send(todos[todo]);
            res.json(todos[todo]);
            return false;
        }
    }
    res.sendStatus(404).send;
});
*/

// POST /todos
app.post('/todos', function(req, res) {
    // Using _.pick to Return a copy of the object, filtered to only have values for the whitelisted keys
    // (or array of valid keys).
    // Alternatively accepts a predicate indicating which keys to pick.
    var body = _.pick(req.body, 'description','completed');

    db.todo.create(body).then(function(todo) {
        res.json(todo.toJSON());
    }, function(e) {
        res.status(400).json(e);
    });

    // if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
    //     return res.status(400).send();
    // }
    //
    // // using trim to remove any extra spaces, either in beginning or end
    // body.description = body.description.trim();
    //
    // body.id = todoNextId;
    // todoNextId += 1;
    //
    // todos.push(body);
    //
    // res.json(body);
});

/*for each loop*/
// GET /todos/:id
/*
app.get('/todos/:id', function(req, res) {
    var todoId = req.params.id;
    var matchedTodo;
    todos.forEach(function(todo) {
        if( todo.id === parseInt(todoId) ) {
            matchedTodo = todo.id
        }
    });

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.sendStatus(404).send();
    }
});
*/

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
    //_.without(array, *values)
    var todoId = parseInt(req.params.id, 10);
    //var matchedTodo = _.findWhere(todos, {id: todoId}); // returns the first json

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function(rowsDeleted) {
        if(rowsDeleted === 0) {
            res.status(404).json({
                error: 'no todo with id'
            });
        } else {
            res.status(204).send();
        }
    }, function() {
        res.status(500).send();
    });

    //Christian's version of deletion
    /*
    db.todo.findById(todoId).then(function(todo) {
        if(!todo) {
            res.status(404).json({"error": "no todo found with that id"});
        } else {
            todo.destroy();
            res.json(todo);
        }
    });
    */

    /*
    if(!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo); // returns the deleted item and a 200
    }
    */
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description','completed');
    var attributes = {};

    if(body.hasOwnProperty('completed')) {
        attributes.completed = body.completed;
    }

    if(body.hasOwnProperty('description')) {
        attributes.description = body.description;
    }

    db.todo.findById(todoId).then(function(todo) {
        if(todo) {
            todo.update(attributes).then(function(todo) {
                res.json(todo.toJSON());
            }, function(e) {
                res.status(400).json(e);
            });
        } else {
            res.status(404).send();
        }
    }, function() {
        res.status(500).send();
    });
});


app.post('/users', function(req, res) {
    var body = _.pick(req.body, 'email', 'password');

    db.user.create(body).then(function(user) {
        res.json(user.toPublicJSON());
    }, function(e) {
        res.status(400).json(e);
    });
});

/*
var body = _.pick(req.body, 'description','completed');

db.todo.create(body).then(function(todo) {
    res.json(todo.toJSON());
}, function(e) {
    res.status(400).json(e);
});
*/

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port: ' + PORT + '!');
    });
});

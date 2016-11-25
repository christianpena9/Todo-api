var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js')

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
    var queryParams = req.query; // object for all params in req
    var q = req.query.q; // object value for q by req
    var filteredTodos = todos;

    // filter used on completed for each todo
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    // filter used on description for each todo
    if(queryParams.hasOwnProperty('q') && q.length > 0) {
        filteredTodos = _.filter(filteredTodos, function(todo) {
            return todo.description.toLowerCase().indexOf(q.toLowerCase()) > -1;
        });
    }

    res.json(filteredTodos);
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
    var matchedTodo = _.findWhere(todos, {id: todoId}); // returns the first json

    if(!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo); // returns the deleted item and a 200
    }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId}); // returns the first json

    var body = _.pick(req.body, 'description','completed');
    var validAttributes = {};

    if(!matchedTodo) {
        return res.status(404).send();
    }

    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if(body.hasOwnProperty('completed')) {
        // something went bad, we got the property completed but it wasn't
        // a boolean
        return res.status(400).send();
    }

    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if(body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    matchedTodo = _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
    app.listen(PORT, function() {
        console.log('Express listening on port: ' + PORT + '!');
    });
});

var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// GET todos
app.get('/todos', function(req, res) {
    res.json(todos);
});

/*
Refactored GET /todos/:id
*/
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});

    if(matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.sendStatus(404).send;
    }
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


    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
        return res.status(404).send();
    }

    // using trim to remove any extra spaces, either in beginning or end
    body.description = body.description.trim();

    body.id = todoNextId;
    todoNextId += 1;

    todos.push(body);

    res.json(body);
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
        res.sendStatus(404).send;
    }
});
*/

app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT + '!');
});

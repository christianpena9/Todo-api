var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
}, {
    id: 2,
    description: 'Go to market',
    completed: false
}, {
    id: 3,
    description: 'Need to feed the cat',
    completed: true
}];

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// GET todos
app.get('/todos', function(req, res) {
    res.json(todos);
});

/*for each loop*/
// GET /todos/:id
/*
app.get('/todos/:id', function(req, res) {
    var todoId = req.params.id;
    todos.forEach(function(todo) {
        if( todo.id === parseInt(todoId) ) {
            res.send(todo);
        }
    });
    res.send(404).send;
});
*/

/*for in loop*/
// GET /todos/:id

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


app.listen(PORT, function() {
    console.log('Express listening on port: ' + PORT + '!');
});

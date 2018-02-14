//Require Express
var express = require( 'express' );
var app = express();

//Get body-parser
var bodyParser = require( 'body-parser' );

//Configure bodyParser to read JSON
app.use(bodyParser.json());

//Mongoose/MongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/angular_restful_task_api');
var taskSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 2 },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false }
}, {timestamps: true});
mongoose.model('Task', taskSchema);
var Task = mongoose.model('Task');
mongoose.Promise = global.Promise;

//Routes
//Retrieve all Tasks
app.get('/tasks', function(req, res){
    Task.find({}, function(err, task){
        if(err){
            console.log("Error from pulling all tasks", err);
            res.json({message: "Error", error: err});
        } else {
            res.json({task});
        };
    });
});

//Retrieve a Task by ID
app.get('/tasks/:id', function(req, res){
    Task.findOne({_id: req.params.id}, function(err, task){
        if(err){
            console.log("Error getting task from mongo");
            res.json({message: "Error", error: err});
        } else {
            res.json({task});
        };
    });
});

//Create a Task
app.post('/tasks', function(req, res){
    var task = new Task({title: req.body.title, description: req.body.description, completed: req.body.completed});

    task.save(function(err){
        if(err){
            console.log('Error while saving name');
            res.json({message: "Error", error: err});
        } else {
            res.redirect('/tasks');
        };
    });
});

//Update a Task by ID
app.put('/tasks/:id', function(req, res){
    Task.update({_id: req.params.id}, req.body, function(err){
        if(err){
            console.log("Error updating: " + err);
            res.json({message: "Error", error: err});
        } else {
            res.redirect('/tasks');
        };
    });
});

//Delete a Task by ID
app.delete('/tasks/:id', function(req, res){
    Task.remove({_id: req.params.id}, function(err, task){
        if(err){
            console.log('Error when deleting from mongo');
            res.json({message: "Error", error: err});
        } else {
            res.redirect('/tasks');
        };
    });
});

//Listen to server
app.listen(8000, function(){
    console.log("Listening to 8000")
});
var http = require('http');
var url = require('url');
var dt = require('./dateModule')
var path = require('path')
var fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;

var app     = express();
var mongo_url = "mongodb://localhost:27017/";

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.get('/Login', function(req, res) {
	var filename = "Login.html";
	var filepath = path.join(__dirname, filename);
	console.log("accessed to login page via get");
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err,data)
    {
  		res.send(data);
  	});
});
app.get('/profile', function(req, res) {
	var filename = "profile.html";
	var filepath = path.join(__dirname, filename);
	console.log("accessed to profile via get");
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err, data)
	{
		res.send(data);
	});
});
app.post('/profile', function(req, res) {
	var filename = "profile.html";
	var filepath = path.join(__dirname, filename);
	console.log("accessed to profile via post");
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err, data)
	{
		res.send(data);
	});
});

app.post('/profilequery', function(req,res){
	var q = url.parse(req.url, true).query;
	var data = req.body;
	var username = data.name;
	var password = data.password;
	console.log("Querying the login request where")
	console.log("username :" + username);
	console.log("password :" + password);
	var flag=0;
	//Accessing the database and querying the data
	mongo.connect(mongo_url, function(err,db){
		if (err) throw err;
		var mdb = db.db("webdb");
		
		mdb.collection("userCredentials").find({name : username},{_id : 0, password : 1}, function(err, result){
			console.log(result);
			if(err) throw err;
			if(password == result.password)
				flag=1;
		});
	});
	if(flag)
		res.send("Log in successful-" + username);
	else
		res.send("Invalid username or password");
});

app.listen(5000, function() {
  console.log('Server running at http://127.0.0.1:5000/');
});
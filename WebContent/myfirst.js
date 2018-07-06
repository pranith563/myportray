var http = require('http');
var url = require('url');
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
app.get('/', function(req, res){
	var filename = "templates/home.html";
	var filepath = path.join(__dirname, filename);
	console.log("Accessed home page");
	fs.readFile(filepath, {encoding: 'utf-8'},function(err, data){
		res.send(data);
	});
	
});

app.get('/Login', function(req, res) {
	var filename = "templates/Login.html";
	var filepath = path.join(__dirname, filename);
	console.log("accessed to login page via get");
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err,data)
    {
  		res.send(data);
  	});
});
app.get('/profile', function(req, res) {
	var filename = "templates/profile.html";
	var filepath = path.join(__dirname, filename);
	console.log("accessed to profile via get");
	fs.readFile(filepath, {encoding: 'utf-8'}, function(err, data)
	{
		res.send(data);
	});
});
app.post('/profile', function(req, res) {
	var filename = "templates/profile.html";
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
	var Username = data.name;
	var Password = data.password;
	console.log("Querying the login request where")
	console.log("username :" + Username);
	console.log("password :" + Password);
	//Accessing the database and querying the data
	mongo.connect(mongo_url, function(err,db){
		if (err) throw err;
		var mdb = db.db("webdb");
		var mquery = {username: Username};
		mdb.collection("userCredentials").find(mquery).toArray(function(err, result){
			if(err) throw err;
			if(Password === result[0].password)
				res.send("Log in successful-" + Username);
			else
				res.send("Invalid username or password");
		});
	});
				
});

app.listen(5000, function() {
  console.log('Server running at http://127.0.0.1:5000/');
});
//Built in modules
var express = require('express');
var fs = require('fs');
var path = require('path');
var url = require('url');

//Initialise a router
var router = express.Router();

//Custom modules
var auth = require('./authenticator');

var sess;
router.get('/', function(req, res){
	res.render('home');
});

router.get('/Login', function(req, res) {
	res.render('Login');
});

router.get('/signup',function(req,res){
	res.render('signup');
});

router.get('/profile', function(req,res){
	if(req.session && req.session.authenticated){
		if(sess.user)
		{
			var profile = req.query.id;
			console.log("accessing profile page " + profile);
			res.render('myprofile',{user : 'sravya', Location: 'unknown', dob: '11-06-97', status: 'single', friend: 'pranith'});
		}
	}
	else
		res.redirect('/Login');
});
router.post('/createprofile', function(req, res){
	var data = req.body;
	var Username = data.name;
	var Password = data.password;
	createProfile(Username,Password);
	res.redirect('/Login');
});
router.post('/profilequery', function(req,res){
	
	var data = req.body;
	var Username = data.name;
	var Password = data.password;
	req.session.user = Username;
	console.log("Querying the login request where")
	console.log("username :" + Username);
	console.log("password :" + Password);
	
	
	//Accessing the database and querying the data
	auth.authenticate(req,Username,Password,res)
	sess = req.session;
});

module.exports = router;
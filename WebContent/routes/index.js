//Built in modules
var express = require('express');
var fs = require('fs');
var path = require('path');
var url = require('url');
var multer =require('multer');
var upload = multer({limits: {filesize: 2000000},dest:'/Users/pranithreddy/Desktop/uploads/'})

// Connect to database
var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/webdb',{ useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {  
	console.log("Connected to database");
});

//Initialise Credential schema
var credential_schema  = mongoose.Schema({
	username: String,
	password: String,
	isUpdated: Boolean,
	profile_id: Number
},{collection: 'userCredentials', versionKey: false });

var Credential = mongoose.model('Credential', credential_schema);

var pid_schema = mongoose.Schema({
	last_inserted : Number
},{collection: 'id', versionKey: false});

var pid_model = mongoose.model('pid_model',pid_schema);

//Initialise Profile schema
var profile_schema = mongoose.Schema({
	_id : Number,
	Name : {fname: String, lname: String},
	nickname: String,
	DOB: Date,
	location: String,
	motive: String,
	mood: String,
	profile_pic: { data: Buffer, contentType: String }
},{collection:'profiledata',versionKey:false});

var profile_model = mongoose.model('profile_model',profile_schema); 

//Initialise a router
var router = express.Router();

//Custom modules
var auth = require('./authenticator');

var sess;

	//Rendering the web pages
router.get('/', function(req, res){
	res.render('templates/home');
});

router.get('/Login', function(req, res) {
	res.render('templates/Login');
});

router.get('/signup',function(req,res){
	res.render('templates/signup');
});

router.get('/completeProfile',function(req,res){
	if(req.session && req.session.authenticated){
		if(sess.user)
		{
			Credential.findOne({'username' : sess.user}, 'isUpdated', function(err, user){
				if(user.isUpdated)
					res.redirect('/profile');
				else
					res.render('templates/completeProfile');
			});
		}
	}
	else
		res.redirect('/Login');
});

router.get('/users/image', function(req,res){
	if(req.session && req.session.authenticated){
		if(sess.user)
		{
			Credential.findOne({'username' : sess.user}, 'profile_id', function(err, userdata){
				var id = userdata.profile_id;
				profile_model.findById(id, function(err, doc){
					res.setHeader('content-type', doc.profile_pic.contentType);
					res.send(doc.profile_pic.data);
				});
			});
		}
	}	
});	


router.get('/profile', function(req,res){
	if(req.session && req.session.authenticated){
		if(sess.user)
		{
			console.log("accessing profile data " + sess.user);
			
			Credential.findOne({'username' : sess.user}, 'profile_id', function(err, userdata){
				var id = userdata.profile_id;
				profile_model.findById(id, function(err, doc){

					res.render('templates/profile',{
													user : sess.user,
													name : doc.nickname,
													dob	 : doc.DOB,
													location : doc.location,
													user_image : "http://localhost:5000/users/image"
						
					});
					
				});
				
			});
		}
	}
	else
		res.redirect('/Login');
});




		/**New profile**/

router.post('/createuser',function(req, res){
	
	var profile_id;
	pid_model.findOne({},'last_inserted',function(err,data){
	
		profile_id = data.last_inserted + 1;
	
		var query = {last_inserted : parseInt(profile_id, 10)-1};
		pid_model.findOneAndUpdate(query, {last_inserted : parseInt(profile_id, 10)}, function(err,affected,resp){});
	
	
		var data = {'username': req.body.name, 
					'password': req.body.password, 
					'isUpdated': false,
					'profile_id': profile_id};
		
		var newUser = new Credential(data);
		newUser.save(function(err, data){});
		console.log(" account created for user : " + req.body.name);
	});
	
});

	/**Profile completion**/


router.post('/updateProfile',upload.single('picture'),function(req,res){
	
	if(req.session && req.session.authenticated){
		if(sess.user)
		{
			
			Credential.findOne({'username' : sess.user}, 'profile_id', function(err, userdata){
			
				console.log('accessing:- updateProfile');		
				var user = sess.user;
				var img_path = req.file.path;
				var image_data = fs.readFileSync(img_path);
				var image = {
						contentType : 'image/png',
						data : image_data
				};
	
				console.log(userdata.profile_id);
				
				var data = {'_id': userdata.profile_id,
							'Name':{'fname':req.body.fname,'lname':req.body.lname},
							'DOB':(req.body.dd+'-'+req.body.mm+'-'+req.body.yyyy),
							'location':(req.body.city+","+req.body.state+","+req.body.country),
							'nickname':req.body.nname,
							'profile_pic':image
							};

				var profiledata = new profile_model(data);
				profiledata.save(function(err,data){
					if(err) return handleError(err);
				});
				console.log("Profile data inserted for user : "+ user);
	
				var query = {username : user};
				Credential.update(query,{isUpdated : true},function(err,affected,resp){});
	
				res.redirect('/profile');
			});
		}
	}
	else
		res.redirect('/Login');
});


		/**Authentication**/

router.post('/authquery', function(req,res){
	//create a session
	sess = req.session;
	sess.user = req.body.name;
	
	//retrieve data from client
	var data = req.body;
	var Username = data.name;
	var Password = data.password;
	
	//access database and query the data
	Credential.findOne({'username' : Username}, 'username password isUpdated', function(err, userdata){
		if (err) return handleError(err);
		if(userdata ===null)
		{
			console.log("Invalid Login");
			res.end("Invalid Login");
		}
		else if(Password === userdata.password)
		{	
			console.log("Log in successful-" + Username);
			console.log("authenticated!");
			req.session.authenticated=true;
			//userdata.isUpdated = true;
			console.log(userdata.isUpdated);
			if(userdata.isUpdated)
				res.send('/profile');
			else
				res.send('/completeProfile');
		}
		else
		{
			console.log("Invalid username or password");
			res.end("invalid username or password");
		}

	});
	
});

	/***Updating Password***/

router.post('/changePassword', function(req,res){
	//retrieve data from client
	var query = { username: req.body.username, password: req.body.password};
	var newPassword = req.body.newPassword;
	//access database and query the data
	Credential.findOne(query, { password: newPassword}, function(err, data){
		if (err) return handleError(err);
	});
	
});


module.exports = router;
var mongo = require('mongodb').MongoClient;
var mongo_url = "mongodb://localhost:27017/";
module.exports = {
		authenticate: function (req,Username, Password,res)
		{
			mongo.connect(mongo_url,{ useNewUrlParser: true }, function(err,db){
				if (err) throw err;
				var mdb = db.db("webdb");
				var mquery = {username: Username};
				mdb.collection("userCredentials").findOne((mquery), function(err, result){	
						if(result ===null)
						{
							console.log("Invalid Login");
							res.end("Invalid Login");
						}
						else if(Password === result.password)
						{
							console.log("Log in successful-" + Username);
							console.log("authenticated!");
							req.session.authenticated=true;
							res.redirect('/profile?id='+Username);
							
						}
						else
						{
							console.log("Invalid username or password");
							res.end("invalid username or password");
						}
				});
		});

	}
};

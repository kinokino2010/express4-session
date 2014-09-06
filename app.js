var express = require('express');
var bodyParser = require('body-parser');
var cookieParser=require('cookie-parser');
var session=require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(cookieParser());
app.use(session({
	secret:'hogehoge',
	resave:false,
	saveUninitialized:false,
	store:new MongoStore({
		db:"express",
	})
}));

app.use(express.static( __dirname + '/public'));

var loginCheck = function(req, res, next) {
    if(req.session.user){
      	console.log("session found.");
      next();
    }else{
      	console.log("session not found.");
	res.redirect('/loginform');
    }
};

app.get("/",loginCheck,function(req,res){
	console.log(req.session);
	res.render("index",{"user":req.session.user.name});
});

app.get("/loginform",function(req,res){
	res.render("login");
});

app.post("/login",function(req,res){
	req.session.user = {
		"name":req.body.name
	};
	res.redirect("/");
});

app.listen(3000);

module.exports = app;

const express = require('express');
const { Op } = require("sequelize"); //needed for sequelize operators

const hbs = require("hbs");
const app = express();

app.use(express.static('public'));

const {
	sequelize, 
	Users,
	Authors, 
	Books, 
	Applications, 
	CartCollections,	
	Sales,
	BookTags,
	Tags,
	Genres,
	Reviews
} = require('./../database.js');

var serverModule = require('./../server.js');

exports.postLogin = function (request, response) { //login check
    if(!request.body) return response.sendStatus(400);
	
	const logged_user = serverModule.getLogged_user();
    const login_name = request.body.login_name;
    const login_password = request.body.login_password;
	
	if(login_name == logged_user){
		hbs.registerHelper("login_result", function(){
			return `You're already logged in!`;
		});
	}
	else {
		Users.findOne({where:{login: login_name, password_text: login_password}, raw:true})
		.then(users=>{
			if (users == null) {
				return response.status(400).send(`The email or password is wrong`);
			}
			else {
				serverModule.setLogged_user(login_name);
				response.redirect(request.get('referer')); //reload page
				serverModule.fillHeader();
			}
		}).catch(err=>console.log(err));
	}
};
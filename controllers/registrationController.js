const express = require('express');
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
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

exports.getRegistration = function (_, response) {
	serverModule.fillHeader();
	response.render('registration');
};

exports.postRegistration = async function (request, response) { //login check
    if(!request.body) return response.sendStatus(400);
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const logged_user = serverModule.getLogged_user();
	const reg_login = request.body.reg_login;
    const reg_email = request.body.reg_email;
    const reg_password = request.body.reg_password;
	const confirm_reg_password = request.body.confirm_reg_password;
	const reg_status = "user";
	
	if(reg_password != confirm_reg_password) {
		await hbs.registerHelper("reg_result", function(){
			return `The second password is not indentical`;
		});
	}
	else if(logged_user != "Not logged in"){
		await hbs.registerHelper("reg_result", function(){
			return `You're already logged in!`;
		});
	}
	else {
		let user = await Users.findOne({where: {[Op.or]: [{email: reg_email}, {login: reg_login}]}, raw:true});
		if (user != null && user.email == reg_email) {
			if (user.email == reg_email) {
				await hbs.registerHelper("reg_result", function(){
					return `This email has already been registered`;
				});
			}
			if (user.login == reg_login) {
				await hbs.registerHelper("reg_result", function(){
					return `This login has already been registered`;
				});
			}
		}
		else {
			await Users.create({password_text: reg_password, email: reg_email, login: reg_login, status_text: "user"});
			serverModule.setLogged_user(reg_login);
		}
	}
	await response.redirect(request.get('referer'));
};
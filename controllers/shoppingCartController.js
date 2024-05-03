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
let logged_user = serverModule.logged_user;

exports.getShoppingCart = function (_, response) {
	serverModule.fillHeader();
	response.render('shoppingCart');
};

exports.postShoppingCart = async function (request, response) {
	if(!request.body) return response.sendStatus(400);
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const application_titles = request.body.applicationTitles;
	const application_date = request.body.applicationDate;
	
	console.log(application_titles);
	console.log(application_date);
	
	const new_cartCollection_id = await CartCollections.max("cartCollection_id") + 1;
	
	for(let i = 0; i < application_titles.length; i++){
		await delay(Math.random() * 10);
		const current_book = await Books.findOne({where: {title: application_titles[i]}});
		const current_book_id = current_book.book_id;
		
		await CartCollections.create({cartCollection_id: new_cartCollection_id, book_id: current_book_id});
	}
	
	const current_user = await Users.findOne({where:{login: logged_user}, raw:true});
	
	await Applications.create({cartCollection_id: new_cartCollection_id, user_id: current_user.user_id, status_text: "pending", date: application_date});
	
	const max_application_id = await Applications.max("application_id");
	
	const date = new Date();
	
	let day = date.getDate();
	if (day < 10) day = '0' + day;
	
	let month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;
	
	let year = date.getFullYear();

	const sale_date = `${year}-${month}-${day}`;
	
	await Sales.create({user_id: current_user.user_id, application_id: max_application_id, cartCollection_id: new_cartCollection_id, date: sale_date });
	
	await response.render('shoppingCart');
};
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

exports.postOrdersAccept = async function (request, response) {
	if(!request.body) return response.sendStatus(400);
	
	const current_cartCollection_id = request.body.cartCollectionId;
	
	await Applications.update({status_text: "accepted"}, {where: {cartCollection_id: current_cartCollection_id}});
	
	await response.redirect('back');
};

exports.postOrdersDecline = async function (request, response) {
	if(!request.body) return response.sendStatus(400);
	
	const current_cartCollection_id = request.body.cartCollectionId;
	await CartCollections.destroy({where: {cartCollection_id: current_cartCollection_id}});
	await Applications.update({status_text: "rejected"}, {where: {cartCollection_id: current_cartCollection_id}});
	
	await response.redirect('back');
};

exports.getOrders = async function (_, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const logged_user = serverModule.getLogged_user();
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user == null || current_logged_user.status_text != "admin"){
		return response.status(400).send(`This page is only accessible to an admin`);
	}
	
	let result_string = "";
	const max_result = await Applications.max("application_id", {where: {status_text: "pending"}});
	
	let i = 1;
	while(i <= max_result){
		await delay(Math.random() * 10);
		const current_application = await Applications.findOne({where:{application_id: {[Op.gte]: i}, status_text: "pending"}, raw:true});
		const current_user = await Users.findByPk(current_application.user_id);
		
		const current_date = current_application.date;
		const current_name = current_user.login;
		
		const max_entry_id = await CartCollections.max("entry_id", {where: {cartCollection_id: current_application.cartCollection_id}});
		
		result_string = result_string + `
		<div class="rq-card">
			<div class="rq-left">
				<p style="margin-bottom: 30px">User: ${current_name}</p>
		`
		
		let j = 1;
		while(j <= max_entry_id) {
			await delay(Math.random() * 10);
			const current_collection = await CartCollections.findOne({where:{entry_id: {[Op.gte]: j}, cartCollection_id: current_application.cartCollection_id}, raw:true});
			
			const current_book_id = current_collection.book_id;
			const current_book = await Books.findOne({where:{book_id: current_book_id}, raw:true});
			
			const current_title = current_book.title;
			const current_price = current_book.price;
			
			result_string = result_string + `
				<p>Book: ${current_title}</p>
				<p style="margin-bottom: 30px">Price: $${current_price}</p>
			`
			
			j = current_collection.entry_id + 1;
		}
		
		result_string = result_string + `
			</div>
			<div class="rq-right">
				<p>${current_date}</p>
			</div>
			<div class="rq-bottom-right">
				<form action="/orders/decline" method="POST">
					<input type="text" name="cartCollectionId" style="display: none" value = "${current_application.cartCollection_id}"/>
					<input type="submit" value="✕" class="fas fa-times"/>
				</form>
				<form action="/orders/accept" method="POST">
					<input type="text" name="cartCollectionId" style="display: none" value = "${current_application.cartCollection_id}"/>
					<input type="submit" value="✓" class="fas fa-check"/>
				</form>
			</div>
		</div>
		`
		
		i = current_application.application_id + 1;
	}
	
	await hbs.registerHelper("applicationList", function(){
		return `${result_string}`;
	});
	
	serverModule.fillHeader();
	
	await response.render('orders');
};
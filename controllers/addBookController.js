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

exports.getAddBook = async function (_, response) {
	const logged_user = serverModule.getLogged_user();
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	console.log(logged_user);
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user == null || current_logged_user.status_text != "admin"){
		return response.status(400).send(`This page is only accessible to an admin`);
	}
	
	let result_string = "";
	const max_result = await Tags.max("tag_id");
	
	(async function loop() {
		let i = 1;
		while(i <= max_result) {
			await delay(Math.random() * 10);
			const current_tag = await Tags.findOne({where:{tag_id: {[Op.gte]: i}}, raw:true});
			const current_tag_name = current_tag.tag_name;
			result_string = result_string + `<option value="${current_tag_name}">${current_tag_name}</option>`;
			i = current_tag.tag_id + 1;
			console.log(i);
		}
		console.log(result_string);
		await delay(Math.random() * 10);
		await hbs.registerHelper("tagsListContent", function(){
			return `${result_string}`;
		});
		
		serverModule.fillHeader();
		
		await response.render('addBook');
	})();
};

exports.postAddBook = async function (request, response) {
	if(!request.body) return response.sendStatus(400);
	
	await serverModule.removeEmptyBookTags();
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const book_title = request.body.bookTitle;
	const book_genre = request.body.bookGenre;
	const book_image = request.file.originalname;
	const book_author = request.body.bookAuthor;
	const book_price = request.body.bookPrice;
	const book_date = request.body.bookDate;
	const book_description = request.body.bookDescription;
	const tags = [];
	
	if(request.body.tags1 != "") tags.push(request.body.tags1);
	if(request.body.tags2 != "") tags.push(request.body.tags2);
	if(request.body.tags3 != "") tags.push(request.body.tags3);
	if(request.body.tags4 != "") tags.push(request.body.tags4);
	if(request.body.tags5 != "") tags.push(request.body.tags5);
	
	const date = new Date();

	let day = date.getDate();
	if (day < 10) day = '0' + day;
	
	let month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;
	
	let year = date.getFullYear();
	
	const book_publish_date = `${year}-${month}-${day}`;

	const current_book = await Books.findOne({where:{title: book_title}, raw:true});
	if (current_book != null) {
		return response.status(400).send(`A book with title "${book_title}" already exists`);
	}
	else {
		const current_genre = await Genres.findOne({where:{genre_name: book_genre}, raw:true});
		const current_author = await Authors.findOne({where:{full_name: book_author}, raw:true});
		
		if (current_author == null) {
			await Authors.create({full_name: book_author});
			const max_author_id = await Authors.max('author_id');
			await Books.create({genre_id: current_genre.genre_id, image_name: book_image, author_id: max_author_id, title: book_title, price: book_price, date: book_date, publish_date: book_publish_date, description: book_description});
		}
		else {
			await Books.create({genre_id: current_genre.genre_id, image_name: book_image, author_id: current_author.author_id, title: book_title, price: book_price, date: book_date, publish_date: book_publish_date, description: book_description});
		}
		
		for(let i = 0; i < tags.length; i++) {
			await delay(Math.random() * 10);
			const current_tag = await Tags.findOne({where:{tag_name: tags[i]}, raw:true});
			const max_book_id = await Books.max('book_id');
			await BookTags.create({book_id: max_book_id, tag_id: current_tag.tag_id});
		}
	}
	
	await response.redirect(`http://localhost:3000/book/${book_title}`);
};
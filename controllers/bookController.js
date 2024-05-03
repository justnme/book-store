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

exports.postBook = async function (request, response) { //comment leaving
    
    if(!request.body) return response.sendStatus(400);
	if(serverModule.logged_user == "Not logged in"){
		return response.status(400).send(`You must be logged in to leave a review`);
	}
	const current_title = request.params.linkTitle;
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	await delay(Math.random() * 10);
	const current_user = await Users.findOne({where:{login: serverModule.logged_user}, raw:true});
	
	await delay(Math.random() * 10);
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	
	const date = new Date();

	let day = date.getDate();
	if (day < 10) day = '0' + day;
	
	let month = date.getMonth() + 1;
	if (month < 10) month = '0' + month;
	
	let year = date.getFullYear();
	
	const comment_user_id = current_user.user_id;
	const comment_book_id = current_book.book_id;
	const comment_rating = request.body.review_rating;
    const comment_message = request.body.review_message;
	const comment_date = `${year}-${month}-${day}`;
	
	await Reviews.create({user_id: comment_user_id, book_id: comment_book_id, rating: comment_rating, content: comment_message, date: comment_date});
	
	response.redirect(request.get('referer')); //reload page
};

exports.postDeleteBook = async function (request, response) {
	const current_title = request.params.linkTitle;
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	
	await BookTags.destroy({where: {book_id: current_book.book_id}});
	await Books.destroy({where: {title: current_title}});
	
	await response.redirect(`http://localhost:3000/home`);
};

exports.postDeleteReview = async function (request, response) {
	const current_title = request.params.linkTitle;
	const current_review_id = request.body.reviewId;
	
	await Reviews.destroy({where: {review_id: current_review_id}});
	
	await response.redirect(`http://localhost:3000/book/${current_title}`);
};

exports.getBook = async function (request, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_title = request.params.linkTitle;
	
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	
	if(current_book == null) {
		return response.status(400).send(`A book with title "${current_title}" does not exist`);
	}
	
	const current_logged_user = await Users.findOne({where: {login: serverModule.logged_user}});
	
	const current_book_author = await Authors.findOne({where:{author_id: current_book.author_id}, raw:true});
	
	const current_book_genre = await Genres.findOne({where:{genre_id: current_book.genre_id}, raw:true});
	
	const current_image = current_book.image_name;
	const current_author = current_book_author.full_name;
	const current_genre = current_book_genre.genre_name;
	const current_price = current_book.price;
	const current_date = current_book.date;
	const current_description = current_book.description;
	
	//Book Tags
	
	const max_bookTag_id = await BookTags.max("entry_id", {where:{book_id: current_book.book_id}});
	
	let result_string0 = `<p>`;
	let i = 1;
	
	while(i <= max_bookTag_id) {
		await delay(Math.random() * 10);
		const current_tag = await BookTags.findOne({where:{book_id: current_book.book_id, entry_id: {[Op.gte]: i}}, raw:true});
		const current_tag_name = await Tags.findOne({where: {tag_id: current_tag.tag_id}});
		
		result_string0 = result_string0 + `${current_tag_name.tag_name}  -  `;
		i = current_tag.entry_id + 1;
		console.log(i);
	}
	result_string0 = result_string0.substring(0, result_string0.length - 3);
	
	await hbs.registerHelper("bookTagList", function(){
		return `${result_string0}`;
	});
	
	await hbs.registerHelper("bookContainer", function(){
		return `<div id = "${current_title}" class="center-content">`;
	});

	await hbs.registerHelper("bookTitle", function(){
		return `<h1 class="book-name" id="BookName">${current_title}</h1>`;
	});
	
	await hbs.registerHelper("bookAuthor", function(){
		return `<span class="font-italic" id="bookAuthor">by ${current_author}</span>`;
	});
	
	await hbs.registerHelper("bookImage", function(){
		return `<img src="/book_images/${current_image}" 	id="bookImage"> `;
	});
	
	await hbs.registerHelper("bookPrice", function(){
		return `<p id="cost">$${current_price}</p>`;
	});
	
	await hbs.registerHelper("bookDescription", function(){
		return `<p>${current_description}</p>`;
	});
	
	await hbs.registerHelper("bookAuthor2", function(){
		return `<span id="bookAuthor2">${current_author}</span>`;
	});
	
	await hbs.registerHelper("bookGenre", function(){
		return `<span>${current_genre}</span>`;
	});
	
	await hbs.registerHelper("bookDate", function(){
		return `<span>${current_date}</span>`;
	});
	
	if(serverModule.logged_user != "Not logged in" && current_logged_user.status_text == "admin"){
		await hbs.registerHelper("adminBookButtons", function(){
			return `
			<a href="http://localhost:3000/editBook/${current_title}" class="btn">Edit</a>
			<form action = "http://localhost:3000/book/${current_title}/deleteBook" method = "POST">
				<button type = "submit" class="btn">Delete</button>
			</form>
			`;
		});
	}
	
	
	//Similar genre list
	await delay(Math.random() * 10);
	
	const book_genre_id = current_book_genre.genre_id;
	const max_genre_id = await Books.max("book_id", {where:{genre_id: book_genre_id, [Op.not]: {book_id: current_book.book_id}}});
	
	let result_string = "";
	i = 1;
	
	limit = 1;
		
	while(i <= max_genre_id && limit <= 10) {
		await delay(Math.random() * 10);
		const genre_book = await Books.findOne({where:{book_id: {[Op.gte]: i}, [Op.not]: {book_id: current_book.book_id}, genre_id: book_genre_id}, raw:true});
		const genre_image = genre_book.image_name;
		const genre_title = genre_book.title;
		const genre_price = genre_book.price;
		
		result_string = result_string + `
		<div class="swiper-slide box">
			<div class="icons">
				<a href="#" class="fas fa-search"></a>
				<a href="#" class="fas fa-heart"></a>
				<a href="#" class="fas fa-eye"></a>
			</div>
			<div class="image">
				<a href="/book/${genre_title}"><img style="max-width: 165.5px" src="/book_images/${genre_image}"></a>
			</div>
			<div class="content">
				<h3>${genre_title}</h3>
				<div class="price">$${genre_price}</div>
				<a href="#" class="btn">add to cart</a>
			</div>
		</div>	
		`;
		i = genre_book.book_id + 1;
		limit++;
		console.log(i);
	}
	console.log(result_string);
	
	//Book comments
	await delay(Math.random() * 10);
	const max_review_id = await Reviews.max("review_id", {where:{book_id: current_book.book_id}});
	
	let result_string2 = "";
	i = 1;
	
	while(i <= max_review_id) {
		await delay(Math.random() * 10);
		const comment = await Reviews.findOne({where:{book_id: current_book.book_id, review_id: {[Op.gte]: i}}, raw:true});
		const comment_user = await Users.findOne({where: {user_id: comment.user_id}});
		
		const comment_user_name = comment_user.login;
		const comment_rating = comment.rating;
		const comment_message = comment.content;
		const comment_date = comment.date;
		
		result_string2 = result_string2 + `
		<div class="review" id="background_cool">
			<div class="review-user"> 
				<p class="username">${comment_user_name}</p>
				<p class="date">${comment_date}</p>
				<p class="rating">${comment_rating} / 5</p>
			</div>
			<p class="message">${comment_message}</p>
		`;
		
		if(serverModule.logged_user != "Not logged in" && (comment_user_name == serverModule.logged_user || current_logged_user.status_text == "admin")){
			result_string2 = result_string2 + `
				<form action="http://localhost:3000/book/${current_title}/deleteReview" method="POST">
					<input type="text" style="display:none" name="reviewId" value="${comment.review_id}">
					<input type="submit" name="formButton" value="Delete" class="btn">
				</form>
			`;
		}
		
		result_string2 = result_string2 + `
		</div>
		`;
		i = comment.review_id + 1;
		console.log(i);
	}
	console.log(result_string2);
	
	await hbs.registerHelper("reviewList", function(){
		return `${result_string2}`;
	});
	
	await hbs.registerHelper("featuredBooks", function(){
		return `${result_string}`;
	});
	
	serverModule.fillHeader();
	
	await response.render('book');
};
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

exports.postEditBook = async function (request, response) {
	if(!request.body) return response.sendStatus(400);
	
	await serverModule.removeEmptyBookTags();
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const original_title = request.body.originalTitle;
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

	const current_book = await Books.findOne({where:{title: original_title}, raw:true});
	
	const current_genre = await Genres.findOne({where:{genre_name: book_genre}, raw:true});
	const current_author = await Authors.findOne({where:{full_name: book_author}, raw:true});
	
	if (current_author == null) {
		await Authors.create({full_name: book_author});
		const max_author_id = await Authors.max('author_id');
		await Books.update({
			genre_id: current_genre.genre_id,
			image_name: book_image,
			author_id: max_author_id,
			title: book_title,
			price: book_price,
			date: book_date,
			description: book_description},
			{where: {book_id: current_book.book_id}});
	}
	else {
		await Books.update({
			genre_id: current_genre.genre_id,
			image_name: book_image,
			author_id: current_author.author_id,
			title: book_title,
			price: book_price,
			date: book_date,
			description: book_description},
			{where: {book_id: current_book.book_id}});
	}
	
	await BookTags.destroy({where: {book_id: current_book.book_id}});
	
	for(let i = 0; i < tags.length; i++) {
		await delay(Math.random() * 10);
		const current_tag = await Tags.findOne({where:{tag_name: tags[i]}, raw:true});
		await BookTags.create({book_id: current_book.book_id, tag_id: current_tag.tag_id});
	}
	
	await response.redirect(`http://localhost:3000/book/${book_title}`);
};

exports.getEditBook = async function (request, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user == null || current_logged_user.status_text != "admin"){
		return response.status(400).send(`This page is only accessible to an admin`);
	}
	
	const current_title = request.params.linkTitle;
	
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	if(current_book == null) {
		return response.status(400).send(`A book with title "${current_title}" does not exist`);
	}
	
	//Book Tags
	const max_tag_id = await Tags.max("tag_id");
	const max_bookTag_id = await BookTags.max("entry_id", {where:{book_id: current_book.book_id}});
	
	let result_string = "";
	let result_string2 = "";
	let i = 1;
	let tag_count = 0;
	
	while(i <= max_bookTag_id) {
		await delay(Math.random() * 10);
		const bookTag = await BookTags.findOne({where:{book_id: current_book.book_id, entry_id: {[Op.gte]: i}}, raw:true});
		const book_tag = await Tags.findOne({where:{tag_id: bookTag.tag_id}});
		const book_tag_name = book_tag.tag_name;
		
		result_string = result_string + `<select id="tags${tag_count + 1}">`;
		
		result_string2 = `<option value=""></option>`;
	
		let j = 1;
		while(j <= max_tag_id) {
			await delay(Math.random() * 10);
			const current_tag = await Tags.findOne({where:{tag_id: {[Op.gte]: j}}, raw:true});
			const current_tag_name = current_tag.tag_name;
			
			if(book_tag_name == current_tag_name) {
				result_string2 = result_string2 + `<option value="${current_tag_name}" selected>${current_tag_name}</option>`;
			}
			else {
				result_string2 = result_string2 + `<option value="${current_tag_name}">${current_tag_name}</option>`;
			}
			j = current_tag.tag_id + 1;
		}
		result_string = result_string + result_string2 + `</select>`
		i = bookTag.entry_id + 1;
		tag_count++;
	}
	result_string2 = "";
	for(i = tag_count; i < 5; i++){
		result_string2 = result_string2 + `
		<select id="tags${tag_count + 1}">
			<option value=""></option>
		`
		for(let j = 1; j <= max_tag_id; j++){
			await delay(Math.random() * 10);
			const current_tag = await Tags.findOne({where:{tag_id: {[Op.gte]: j}}, raw:true});
			const current_tag_name = current_tag.tag_name;
			result_string2 = result_string2 + `<option value="${current_tag_name}">${current_tag_name}</option>`;
		}
		result_string2 = result_string2 + `</select>`;
		tag_count++;
	}
	
	result_string = result_string + result_string2;
	
	await hbs.registerHelper("bookTags", function(){
		return `${result_string}`;
	});
	
	//Book Genres
	
	const current_book_genre = await Genres.findOne({where:{genre_id: current_book.genre_id}, raw:true});
	const book_genre_name = current_book_genre.genre_name;
	const max_genre_id = await Genres.max("genre_id");
	
	let result_string3 = `<select id="bookGenre">`;
	
	for(let j = 1; j < max_genre_id; j++) {
		await delay(Math.random() * 10);
		const current_genre = await Genres.findOne({where:{genre_id: j}, raw:true});
		const current_genre_name = current_genre.genre_name;
		
		if(book_genre_name == current_genre_name) {
			result_string3 = result_string3 + `<option value="${current_genre_name}" selected>${current_genre_name}</option>`;
		}
		else {
			result_string3 = result_string3 + `<option value="${current_genre_name}">${current_genre_name}</option>`;
		}
	}
	
	result_string3 = result_string3 + `</select>`;
	
	await hbs.registerHelper("bookGenre", function(){
		return `${result_string3}`;
	});
	
	//All other fields
	
	const current_book_author = await Authors.findOne({where:{author_id: current_book.author_id}, raw:true});
	
	const current_image = current_book.image_name;
	const current_author = current_book_author.full_name;
	const current_genre = current_book_genre.genre_name;
	const current_price = current_book.price;
	const current_date = current_book.date;
	const current_description = current_book.description;

	await hbs.registerHelper("bookTitle", function(){
		return `
		<input id="originalTitle" value="${current_title}" type="text" style="display:none;" />
		<input id="bookTitle" value="${current_title}" type="text" required>
		`;
	});
	
	await hbs.registerHelper("bookAuthor", function(){
		return `<input id="bookAuthor" value="${current_author}" type="text" required>`;
	});
	
	await hbs.registerHelper("bookImage", function(){
		return `<img id="image" src="../book_images/${current_image}" />`;
	});
	
	await hbs.registerHelper("bookPrice", function(){
		return `<input id="bookPrice" type="number" value="${current_price}" min="0.00" step="0.01" required>`;
	});
	
	await hbs.registerHelper("bookDescription", function(){
		return `
		<textarea required id="bookDescription"
			class="form-control user-profile-bio-field js-length-limited-input"
			placeholder="Write down the description of the book" data-input-max-length="300">${current_description}</textarea>
		`;
	});
	
	await hbs.registerHelper("bookDate", function(){
		return `<input value="${current_date}" id="bookDate" type="date" required>`;
	});
	
	serverModule.fillHeader();
	await response.render('editBook');
};
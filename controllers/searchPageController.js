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

exports.getSearchPage = function (_, response) {
	serverModule.fillHeader();
	response.render('searchPage');
};

exports.postSearchPage = async function (request, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const search_text = request.body.searchText;
	const max_book_id = await Books.max("book_id", {where: {title: {[Op.like]: '%' + search_text + '%'}}, raw:true});
	
	let result_string = "";
	let i = 1;
	
	console.log(max_book_id);
	
	while(i <= max_book_id){
		await delay(Math.random() * 10);
		const current_book = await Books.findOne({where:{book_id: {[Op.gte]: i}, title: {[Op.like]: '%' + search_text + '%'}}, raw:true});
		const current_author = await Authors.findOne({where:{author_id: current_book.author_id}, raw:true});
		
		const current_image = current_book.image_name;
		const current_author_name = current_author.full_name;
		const current_title = current_book.title;
		const current_price = current_book.price;
		
		result_string = result_string +
		`
		<div class="search-container">
			<div>
				<h2 class="book-title">${current_title}</h2>
				<p class="book-author">by ${current_author_name}</p>
				<div>
					<a href="/book/${current_title}"><img class="book-image" src="book_images/${current_image}" alt="Wish you were here"></a>
					<p class="book-price">$${current_price}</p>
				</div>
			</div>
        </div>
		`
		i = current_book.book_id + 1;
	}
	
	if(result_string != ""){
		result_string = `
		<div id="Centre_search">
			<div id="Search">
		` + result_string + `
			</div>
		</div>
		`;
	}
	
	await hbs.registerHelper("searchValue", function(){
		return `${search_text}`;
	});
	
	await hbs.registerHelper("searchList", function(){
		return `${result_string}`;
	});
	
	await response.render('searchPage');
};
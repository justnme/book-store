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

exports.getHome = async function (_, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); //This is all for book on the home screen
	
	let result_string = "";
		
	//Top book list
	
	await delay(Math.random() * 10);
	const book_list = await Books.findAll();
	let used_book_ids = [];
	
	let i = 1;
	while(i <= 10 && i <= book_list.length) {
		await delay(Math.random() * 10);
		
		let current_book_id = 0;
		do {
			current_book_id = Math.floor(Math.random() * book_list.length);
		} while(used_book_ids.indexOf(current_book_id) != -1);
		used_book_ids.push(current_book_id);
		console.log("---------------" + current_book_id + "------------------");
		
		const current_book = book_list[current_book_id];
		const current_image = current_book.image_name;
		const current_title = current_book.title;
		result_string = result_string +
		 `<a href="/book/${current_title}"
		 class="swiper-slide">
		 <img style="max-width: 165.5px" 
		 src="/book_images/${current_image}" alt="">
		 </a>`;
		i++;
		console.log(i);
	}
	console.log(result_string);
	await delay(Math.random() * 10);
	await hbs.registerHelper("book_carousel", function(){
		return `${result_string}`;
	});
	
	//Featured list
	let max_result = await Books.max("book_id");
	
	await delay(Math.random() * 10);
	const featured_tag = await Tags.findOne({where:{tag_name: "featured"}, raw:true});
	max_result = await BookTags.max("book_id", {where:{tag_id: featured_tag.tag_id}});
	
	let result_string2 = "";
	i = 1;
	let limit = 1;
	
	while(i <= max_result && limit <= 12) {
		await delay(Math.random() * 10);
		const current_book_tag = await BookTags.findOne({where:{book_id: {[Op.gte]: i}, tag_id: featured_tag.tag_id}, raw:true});
		const current_book = await Books.findByPk(current_book_tag.book_id);
		const current_image = current_book.image_name;
		const current_title = current_book.title;
		const current_price = current_book.price;
		
		result_string2 = result_string2 + `
		<div class="swiper-slide box">
			<div class="icons">
				<a href="/book/${current_title}" class="fas fa-search"></a>
				<a href="/book/${current_title}" class="fas fa-heart"></a>
				<a href="/book/${current_title}" class="fas fa-eye"></a>
			</div>
			<div class="image">
				<a href="/book/${current_title}"><img style="max-width: 165.5px" src="/book_images/${current_image}"></a>
			</div>
			<div class="content">
				<h3>${current_title}</h3>
				<div class="price">$${current_price}</div>
				<a href="/book/${current_title}" class="btn">add to cart</a>
			</div>
		</div>	
		`;
		i = current_book.book_id + 1;
		limit++;
		console.log(i);
	}
	console.log(result_string2);
	await delay(Math.random() * 10);
	await hbs.registerHelper("featuredBooks", function(){
		return `${result_string2}`;
	});
	
	//new arrivals
	result_string3 = `
	<div class="swiper arrivals-slider">
		<div class="swiper-wrapper">
	`;
	i = 0;
	limit = 12;
	while(i < limit / 2) {
		await delay(Math.random() * 10);
		const current_book = await Books.findAll({order: [["publish_date", "DESC"]], raw:true});
		
		console.log(current_book[i]);
		
		const current_image = current_book[i].image_name;
		const current_title = current_book[i].title;
		const current_price = current_book[i].price;
		const current_ratings = await Reviews.findAll({where: {book_id: current_book[i].book_id}, raw: true});
		
		let average_rating = 0.0;
		let j = 0;
		const rating_count = await Reviews.count({where: {book_id: current_book[i].book_id}, raw: true});
		if(rating_count != 0){
			while(j < rating_count){
				average_rating += parseFloat(current_ratings[j].rating);
				j++;
			}
			average_rating /= rating_count;
			average_rating = average_rating + " / 5"
		}
		else average_rating = "No reviews yet";
		
		result_string3 = result_string3 + `
			<a href="/book/${current_title}" class="swiper-slide box">
				<div class="image">
					<img style="max-width: 100px" src="/book_images/${current_image}">
				</div>
				<div class="content">
					<h3>${current_title}</h3>
					<div class="price">$${current_price}</div>
					<div style="font-size: 20px">
						${average_rating}
					</div>
				</div>
			</a>
		`;
		i++;
		console.log(i);
	}
	
	result_string3 = result_string3 + `
		</div>
	</div>
	<div class="swiper arrivals-slider">
		<div class="swiper-wrapper">
	`;
	
	while(i < limit) {
		await delay(Math.random() * 10);
		const current_book = await Books.findAll({order: [["publish_date", "DESC"]], raw:true});
		
		const current_image = current_book[i].image_name;
		const current_title = current_book[i].title;
		const current_price = current_book[i].price;
		const current_ratings = await Reviews.findAll({where: {book_id: current_book[i].book_id}, raw: true});
		
		let average_rating = 0.0;
		let j = 0;
		const rating_count = await Reviews.count({where: {book_id: current_book[i].book_id}, raw: true});
		if(rating_count != 0){
			while(j < rating_count){
				average_rating += parseFloat(current_ratings[j].rating);
				j++;
			}
			average_rating /= rating_count;
			average_rating = average_rating.toFixed(1) + " / 5"
		}
		else average_rating = "No reviews yet";
		
		console.log(average_rating);
		
		result_string3 = result_string3 + `
			<a href="/book/${current_title}" class="swiper-slide box">
				<div class="image">
					<img style="max-width: 100px" src="/book_images/${current_image}">
				</div>
				<div class="content">
					<h3>${current_title}</h3>
					<div class="price">$${current_price}</div>
					<div style="font-size: 20px">
						${average_rating}
					</div>
				</div>
			</a>
		 `;
		i++;
		console.log(i);
	}
	
	result_string3 = result_string3 + `
		</div>
	</div>
	`;
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("new_arrivalsList", function(){
		return `${result_string3}`;
	});
	// idk
	// await delay(Math.random() * 10);
	// await hbs.registerHelper("email_box", function(){
	// 	return ` <input type="email" name="Gmail" placeholder="enter your email" id="gmail" class="box"
	// 	value="${current_tag_name}">`;
	// });
	
	serverModule.fillHeader();
	
	await response.render('index');
};
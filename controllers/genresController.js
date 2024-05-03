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

exports.getGenres = async function (_, response) {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const genre_amount = await Genres.count();
	
	let result_string = "";
	
	let i = 1;
	while(i <= genre_amount){
		await delay(Math.random() * 10);
		
		const current_genre = await Genres.findOne({where:{genre_id: {[Op.gte]: i}}, raw:true});
		
		const current_genre_name = current_genre.genre_name;
		const current_genre_id = current_genre.genre_id;
		
		result_string = result_string +
		`
		<section class="featured" id="featured">
			<h1 class="heading"> <span>${current_genre_name}</span> </h1>
			<div class="swiper featured-slider">
				<div class="swiper-wrapper">
		`;
		
		let max_genre_id = await Books.max("book_id", {where: {genre_id: current_genre_id}});
		
		let j = 1;
		while(j <= max_genre_id){
			await delay(Math.random() * 10);
			const current_book = await Books.findOne({where:{book_id: {[Op.gte]: j}, genre_id: current_genre_id}, raw:true});
			const current_image = current_book.image_name;
			const current_title = current_book.title;
			const current_price = current_book.price;
			
			result_string = result_string +
			`
                <div class="swiper-slide box">
                    <div class="icons">
                        <a href="#" class="fas fa-search"></a>
                        <a href="#" class="fas fa-heart"></a>
                        <a href="#" class="fas fa-eye"></a>
                    </div>
                    <div class="image">
                        <a href="/book/${current_title}"><img style="max-width: 165.5px" src="/book_images/${current_image}"></a>
                    </div>
                    <div class="content">
                        <h3>${current_title}</h3>
                        <div class="price">$${current_price}</div>
                        <a href="#" class="btn">add to cart</a>
                    </div>
					
                </div>
				
			`
			
			j = current_book.book_id + 1;
		}
		
		result_string = result_string +
		`
		
            </div>
		
		</section>
		`;
		// removed due quick bugs
		// <div class="swiper-button-next"></div>
		// <div class="swiper-button-prev"></div>
		i = current_genre.genre_id + 1;
	}
	
	await hbs.registerHelper("genreList", function(){
		return `${result_string}`;
	});
	
	serverModule.fillHeader();
	
	await response.render('genres');
};
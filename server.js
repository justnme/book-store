
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

const express = require('express');
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const { Op } = require("sequelize"); //needed for sequelize operators

const hbs = require("hbs");
const app = express();

// o((>ω< ))o
app.use(express.static('public'));

const port = 3000;
// #4 hbs conf
const path = require('path');

let logged_user = "Not logged in";
// let logged_user = "AdminGuy";

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Register partials directory
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.static(__dirname));

//needed for image saving
const multer = require('multer');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// ---------DATABASE------------->>>
// ┳━┳ ノ( ゜-゜ノ)
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
} = require('./database.js');

sequelize.sync().then(result=>{
	console.log(result);
})
.catch(err=> console.log(err));

// <<<---------DATABASE------------

async function fillHeader(){
	await hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	
	const current_user = await Users.findOne({where:{login: logged_user}, raw:true});
	if(current_user != null && current_user.status_text == "admin") {
		await hbs.registerHelper("adminButtons", function(){
			return `
			<a href='http://localhost:3000/addBook'>Add book</a>
			<a href='http://localhost:3000/orders'>Orders</a>
			<a href='http://localhost:3000/accepted_orders'>Accepted Orders</a>
			`;
		});
	}
	else {
		await hbs.registerHelper("adminButtons", function(){
			return ``;
		});
	}
}

app.get('/', (_, response) => {
	response.redirect('home'); //I hope this works now
    //response.render('index');
});
app.get('/registration', (_, response) => {
	fillHeader();
	response.render('registration');
});
app.get('/searchPage', (_, response) => {
	fillHeader();
	response.render('searchPage');
});
app.post("/registration", urlencodedParser, function (request, response) { //login check
    if(!request.body) return response.sendStatus(400);
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const reg_login = request.body.reg_login;
    const reg_email = request.body.reg_email;
    const reg_password = request.body.reg_password;
	const confirm_reg_password = request.body.confirm_reg_password;
	const reg_status = "user";
	
	(async function reg_Checks() {
		if(reg_password != confirm_reg_password) {
			await delay(Math.random() * 10);
			await hbs.registerHelper("reg_result", function(){
				return `The second password is not indentical`;
			});
		}
		else if(reg_login == logged_user){
			await delay(Math.random() * 10);
			await hbs.registerHelper("reg_result", function(){
				return `You're already logged in!`;
			});
		}
		else {
			await delay(Math.random() * 10);
			let user = await Users.findOne({where: {[Op.or]: [{email: reg_email}, {login: reg_login}]}, raw:true});
			await delay(Math.random() * 10);
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
				logged_user = reg_login;
			}
		}
		await response.redirect(request.get('referer')); //reload page
	})();
});

app.get('/book/:linkTitle', async (request, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_title = request.params.linkTitle;
	
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	
	if(current_book == null) {
		return response.status(400).send(`A book with title "${current_title}" does not exist`);
	}
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
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
	
	if(logged_user != "Not logged in" && current_logged_user.status_text == "admin"){
		await hbs.registerHelper("adminBookButtons", function(){
			return `
			<a href="http://localhost:3000/editBook/${current_title}" class="btn">Edit</a>
			<form action = "http://localhost:3000/book/${current_title}/deleteBook" method = "POST">
				<button type = "submit" class="btn">Delete</button>
			</form>
			`;
		});
	}
	
	
	//Featured list
	await delay(Math.random() * 10);
	
	const featured_tag = await Tags.findOne({where:{tag_name: "featured"}, raw:true});
	const max_featured_id = await BookTags.max("book_id", {where:{tag_id: featured_tag.tag_id, [Op.not]: {book_id: current_book.book_id}}});
	
	let result_string = "";
	i = 1;
	
	while(i <= max_featured_id) {
		await delay(Math.random() * 10);
		const featured_book_tag = await BookTags.findOne({where:{book_id: {[Op.gte]: i}, [Op.not]: {book_id: current_book.book_id}, tag_id: featured_tag.tag_id}, raw:true});
		const featured_book = await Books.findByPk(featured_book_tag.book_id);
		const featured_image = featured_book.image_name;
		const featured_title = featured_book.title;
		const featured_price = featured_book.price;
		
		result_string = result_string + `
		<div class="swiper-slide box">
			<div class="icons">
				<a href="#" class="fas fa-search"></a>
				<a href="#" class="fas fa-heart"></a>
				<a href="#" class="fas fa-eye"></a>
			</div>
			<div class="image">
				<a href="/book/${featured_title}"><img style="max-width: 165.5px" src="/book_images/${featured_image}"></a>
			</div>
			<div class="content">
				<h3>${featured_title}</h3>
				<div class="price">$${featured_price}</div>
				<a href="#" class="btn">add to cart</a>
			</div>
		</div>	
		`;
		i = featured_book.book_id + 1;
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
		<div class="review">
			<div class="review-user"> 
				<p class="username">${comment_user_name}</p>
				<p class="date">${comment_date}</p>
				<p class="rating">${comment_rating} / 5</p>
			</div>
			<p class="message">${comment_message}</p>
		`;
		
		if(logged_user != "Not logged in" && (comment_user_name == logged_user || current_logged_user.status_text == "admin")){
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
	
	fillHeader();
	
	await response.render('book');
});

app.get("/editBook/:linkTitle", async (request, response) => {
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
	
	fillHeader();
	await response.render('editBook');
});

app.post("/book/:linkTitle/deleteBook", urlencodedParser, async function (request, response) {
	const current_title = request.params.linkTitle;
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	
	await BookTags.destroy({where: {book_id: current_book.book_id}});
	await Books.destroy({where: {title: current_title}});
	
	await response.redirect(`http://localhost:3000/home`);
});

app.post("/book/:linkTitle/deleteReview", urlencodedParser, async function (request, response) {
	const current_title = request.params.linkTitle;
	const current_review_id = request.body.reviewId;
	
	await Reviews.destroy({where: {review_id: current_review_id}});
	
	await response.redirect(`http://localhost:3000/book/${current_title}`);
});

app.post("/book/:linkTitle", urlencodedParser, async function (request, response) { //comment leaving
    
    if(!request.body) return response.sendStatus(400);
	if(logged_user == "Not logged in"){
		return response.status(400).send(`You must be logged in to leave a review`);
	  }
	const current_title = request.params.linkTitle;
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	await delay(Math.random() * 10);
	const current_user = await Users.findOne({where:{login: logged_user}, raw:true});
	
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
});

  
app.get('/shoppingCart', (_, response) => {
	fillHeader();
	
	response.render('shoppingCart');
});

app.post('/shoppingCart', urlencodedParser, async (request, response) => {
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
});
   
app.get('/orders', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
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
	
	fillHeader();
	
	await response.render('orders');
});

app.get('/accepted_orders', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user == null || current_logged_user.status_text != "admin"){
		return response.status(400).send(`This page is only accessible to an admin`);
	}
	
	let result_string = "";
	const max_result = await Applications.max("application_id", {where: {status_text: "accepted"}});
	
	let i = 1;
	while(i <= max_result){
		await delay(Math.random() * 10);
		const current_application = await Applications.findOne({where:{application_id: {[Op.gte]: i}, status_text: "accepted"}, raw:true});
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
			</div>
		</div>
		`
		
		i = current_application.application_id + 1;
	}
	
	await hbs.registerHelper("acceptedApplicationList", function(){
		return `${result_string}`;
	});
	
	fillHeader();
	
	await response.render('accepted_orders');
});

app.post('/orders/accept', urlencodedParser, async (request, response) => {
	if(!request.body) return response.sendStatus(400);
	
	const current_cartCollection_id = request.body.cartCollectionId;
	
	await Applications.update({status_text: "accepted"}, {where: {cartCollection_id: current_cartCollection_id}});
	
	await response.redirect('back');
});

app.post('/orders/decline', urlencodedParser, async (request, response) => {
	if(!request.body) return response.sendStatus(400);
	
	const current_cartCollection_id = request.body.cartCollectionId;
	await CartCollections.destroy({where: {cartCollection_id: current_cartCollection_id}});
	await Applications.update({status_text: "rejected"}, {where: {cartCollection_id: current_cartCollection_id}});
	
	await response.redirect('back');
});

app.get('/addBook', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
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
		
		fillHeader();
		
		await response.render('addBook');
	})();
});

app.get('/genres', async (_, response) => {
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
	
	fillHeader();
	
	await response.render('genres');
});

app.get('/home', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); //This is all for book on the home screen
	let result_string = "";
	let max_result = await Books.max("book_id");
	
	(async function loop() {
		
		//Top book list
		let i = 1;
		let limit = 1;
		while(i <= max_result && limit <= 10) {
			await delay(Math.random() * 10);
			const current_book = await Books.findOne({where:{book_id: {[Op.gte]: i}}, raw:true});
			const current_image = current_book.image_name;
			const current_title = current_book.title;
			result_string = result_string +
			 `<a href="/book/${current_title}"
			 class="swiper-slide">
			 <img style="max-width: 165.5px" 
			 src="/book_images/${current_image}" alt="">
			 </a>`;
			i = current_book.book_id + 1;
			limit++;
			console.log(i);
		}
		console.log(result_string);
		await delay(Math.random() * 10);
		await hbs.registerHelper("book_carousel", function(){
			return `${result_string}`;
		});
		
		//Featured list
		await delay(Math.random() * 10);
		const featured_tag = await Tags.findOne({where:{tag_name: "featured"}, raw:true});
		max_result = await BookTags.max("book_id", {where:{tag_id: featured_tag.tag_id}});
		
		let result_string2 = "";
		i = 1;
		limit = 1;
		
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
			const current_book = await Books.findAll({order: [["date", "DESC"]], raw:true});
			
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
			const current_book = await Books.findAll({order: [["date", "DESC"]], raw:true});
			
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
		
		await fillHeader();
		
		await response.render('index');
	})();
});


async function removeEmptyBoogTags(){
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const max_bookTag = await BookTags.max("book_id");
	let i = 1;
	while(i <= max_bookTag) {
		await delay(Math.random() * 10);
		const current_tag = await BookTags.findOne({where:{book_id: {[Op.gte]: i}}, raw:true});
		const current_BookTag_id = current_tag.book_id;
		const current_book = await Books.findOne({where:{book_id: current_BookTag_id}, raw:true});
		
		if(current_book == null) BookTags.destroy({where: {book_id: current_BookTag_id}});
		
		i = current_BookTag_id + 1;
	}
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'book_images/') // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // File name
    }
});

const upload = multer({
    storage: storage
}).single('bookImage');

app.post("/editBook", upload, async (request, response) => {
	if(!request.body) return response.sendStatus(400);
	
	await removeEmptyBoogTags();
	
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
	
	upload(request, response, (err) => {
        if (err) {
            console.error(err);
            response.status(500).send('Error uploading file');
        }
    });

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
});

app.post("/addBook", upload, async (request, response) => {
	if(!request.body) return response.sendStatus(400);
	
	await removeEmptyBoogTags();
	
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
	
	upload(request, response, (err) => {
        if (err) {
            console.error(err);
            response.status(500).send('Error uploading file');
        }
    });

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
			await Books.create({genre_id: current_genre.genre_id, image_name: book_image, author_id: max_author_id, title: book_title, price: book_price, date: book_date, description: book_description});
		}
		else {
			await Books.create({genre_id: current_genre.genre_id, image_name: book_image, author_id: current_author.author_id, title: book_title, price: book_price, date: book_date, description: book_description});
		}
		
		for(let i = 0; i < tags.length; i++) {
			await delay(Math.random() * 10);
			const current_tag = await Tags.findOne({where:{tag_name: tags[i]}, raw:true});
			const max_book_id = await Books.max('book_id');
			await BookTags.create({book_id: max_book_id, tag_id: current_tag.tag_id});
		}
	}
	
	await response.redirect(`http://localhost:3000/book/${book_title}`);
});

app.post("/home", urlencodedParser, function (request, response) { //login check
    
    if(!request.body) return response.sendStatus(400);
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
				hbs.registerHelper("login_result", function(){
					return `The email or password is wrong`;
				});
			}
			else {
				logged_user = login_name;
				hbs.registerHelper("login_result", function(){
					return ``;
				});
			}
		}).catch(err=>console.log(err));
	}
	response.redirect(request.get('referer')); //reload page
});

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});
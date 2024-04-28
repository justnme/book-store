
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

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "bookStore.db",
	define: {
		timestamps: false
	}
});

const Users = sequelize.define("Users", {
	user_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	password_text: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	login: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	status_text: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

const Authors = sequelize.define("Authors", {
	author_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	full_name: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const Books = sequelize.define("Books", {
	book_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	genre_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	image_name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	author_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	price: {
		type: Sequelize.DOUBLE,
		allowNull: false,
	},
	date: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	}
});

const Applications = sequelize.define("Applications", {
	application_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	cartCollection_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	status_text: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	date: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const CartCollections = sequelize.define("CartCollections", {
	entry_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	cartCollection_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	book_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	}
});

const Sales = sequelize.define("Sales", {
	sale_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	application_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	book_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	date: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const BookTags = sequelize.define("BookTags", {
	entry_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	book_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	tag_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	}
});

const Tags = sequelize.define("Tags", {
	tag_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	tag_name: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const Genres = sequelize.define("Genres", {
	genre_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	genre_name: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

const Reviews = sequelize.define("Reviews", {
	review_id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	book_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	rating: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	content: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	date: {
		type: Sequelize.STRING,
		allowNull: false,
	}
});

sequelize.sync().then(result=>{
	console.log(result);
})
.catch(err=> console.log(err));

// <<<---------DATABASE------------

app.get('/', (_, response) => {
	response.redirect('home'); //I hope this works now
    //response.render('index');
});
app.get('/registration', (_, response) => {
	hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	response.render('registration');
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
	
	await delay(Math.random() * 10);
	const current_book = await Books.findOne({where:{title: current_title}, raw:true});
	if(current_book == null) {
		return response.status(400).send(`A book with title "${current_title}" does not exist`);
	}
	
	await delay(Math.random() * 10);
	const current_book_author = await Authors.findOne({where:{author_id: current_book.author_id}, raw:true});
	
	await delay(Math.random() * 10);
	const current_book_genre = await Genres.findOne({where:{genre_id: current_book.genre_id}, raw:true});
	
	await delay(Math.random() * 10);
	const current_image = current_book.image_name;
	const current_author = current_book_author.full_name;
	const current_genre = current_book_genre.genre_name;
	const current_price = current_book.price;
	const current_date = current_book.date;
	const current_description = current_book.description;
	// just ll do the same
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookContainer", function(){
		return `<div id = "${current_title}">`;
	});

	await delay(Math.random() * 10);
	await hbs.registerHelper("bookTitle", function(){
		return `<h1 class="book-name">${current_title}</h1>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookAuthor", function(){
		return `<span class="font-italic">by ${current_author}</span>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookImage", function(){
		return `<img src="/book_images/${current_image}">`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookPrice", function(){
		return `<p id="cost">$${current_price}</p>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookDescription", function(){
		return `<p>${current_description}</p>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookAuthor2", function(){
		return `<span>${current_author}</span>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookGenre", function(){
		return `<span>${current_genre}</span>`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("bookDate", function(){
		return `<span>${current_date}</span>`;
	});
	
	
	//Featured list
	await delay(Math.random() * 10);
	const featured_tag = await Tags.findOne({where:{tag_name: "featured"}, raw:true});
	const max_result = await BookTags.max("book_id", {where:{tag_id: featured_tag.tag_id, [Op.not]: {book_id: current_book.book_id}}});
	
	let result_string = "";
	let i = 1;
	
	while(i <= max_result) {
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
		const comment = await Reviews.findOne({where:{review_id: {[Op.gte]: i}}, raw:true});
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
		</div>
		`;
		i = comment.review_id + 1;
		console.log(i);
	}
	console.log(result_string2);
	
	await hbs.registerHelper("reviewList", function(){
		return `${result_string2}`;
	});
	
	await hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	
	await delay(Math.random() * 10);
	await hbs.registerHelper("featuredBooks", function(){
		return `${result_string}`;
	});
	
	await response.render('book');
});


app.post("/book/:linkTitle", urlencodedParser, async function (request, response) { //comment leaving
    
    if(!request.body) return response.sendStatus(400);
	
	if(logged_user == "Not logged in"){
		return response.status(400).send(`You're not logged in!`);
	}
	
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_title = request.params.linkTitle;
	
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
	hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	response.render('shoppingCart');
});
   
app.get('/orders', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user.status_text != "admin"){
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
	
	await hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	await response.render('orders');
});

app.get('/accepted_orders', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user.status_text != "admin"){
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
	
	await hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
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
	await Applications.destroy({where: {cartCollection_id: current_cartCollection_id}});
	
	await response.redirect('back');
});

app.get('/addBook', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
	
	const current_logged_user = await Users.findOne({where: {login: logged_user}});
	
	if(current_logged_user.status_text != "admin"){
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
		
		await hbs.registerHelper("userName", function(){
			return `${logged_user}`;
		});
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
                        <a href="/book/${current_title}"><img style="max-width: 165.5px" src="book_images/${current_image}"></a>
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
		
		i = current_genre.genre_id + 1;
	}
	
	await hbs.registerHelper("genreList", function(){
		return `${result_string}`;
	});
	
	await hbs.registerHelper("userName", function(){
		return `${logged_user}`;
	});
	await response.render('genres');
});

app.get('/home', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); //This is all for book on the home screen
	let result_string = "";
	let max_result = await Books.max("book_id");
	
	(async function loop() {
		
		//Top book list
		let i = 1;
		while(i <= max_result) {
			await delay(Math.random() * 10);
			const current_book = await Books.findOne({where:{book_id: {[Op.gte]: i}}, raw:true});
			const current_image = current_book.image_name;
			const current_title = current_book.title;
			result_string = result_string +
			 `<a href="/book/${current_title}"
			 class="swiper-slide">
			 <img style="max-width: 165.5px" 
			 src="book_images/${current_image}" alt="">
			 </a>`;
			i = current_book.book_id + 1;
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
		
		while(i <= max_result) {
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
					<a href="/book/${current_title}"><img style="max-width: 165.5px" src="book_images/${current_image}"></a>
				</div>
				<div class="content">
					<h3>${current_title}</h3>
					<div class="price">$${current_price}</div>
					<a href="#" class="btn">add to cart</a>
				</div>
			</div>	
			`;
			i = current_book.book_id + 1;
			console.log(i);
		}
		console.log(result_string2);
		await delay(Math.random() * 10);
		await hbs.registerHelper("featuredBooks", function(){
			return `${result_string2}`;
		});
		
		await response.render('index');
	})();
});


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

app.post("/addBook", upload, async (request, response) => {
	if(!request.body) return response.sendStatus(400);
	
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

	Books.findOne({where:{title: book_title}, raw:true})
	.then(book=>{
		if (book != null) {
			//Add something here so that the user knows the book already exists
		}
		else {
			Genres.findOne({where:{genre_name: book_genre}, raw:true})
			.then(genre=>{
				
				Authors.findOne({where:{full_name: book_author}, raw:true})
				.then(author=>{
					if (author != null) {
						Books.create({genre_id: genre.genre_id, image_name: book_image, author_id: author.author_id, title: book_title, price: book_price, date: book_date});
					}
					else {
						Authors.create({full_name: book_author});
						
						Authors.max('author_id')
						.then(authorId=>{
							Books.create({genre_id: genre.genre_id, image_name: book_image, author_id: authorId, title: book_title, price: book_price, date: book_date, description: book_description});
						}).catch(err=>console.log(err));
					}
					
					for(let i = 0; i < tags.length; i++) {
						Tags.findOne({where:{tag_name: tags[i]}, raw:true})
						.then(tag=>{
							
							Books.max('book_id')
							.then(bookId=>{
								BookTags.create({book_id: bookId, tag_id: tag.tag_id});
							}).catch(err=>console.log(err));
							
						}).catch(err=>console.log(err));
					}
				}).catch(err=>console.log(err));
				
			}).catch(err=>console.log(err));
		}
	}).catch(err=>console.log(err)); 
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
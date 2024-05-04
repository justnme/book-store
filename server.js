
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

const express = require('express');
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const { Op } = require("sequelize"); //needed for sequelize operators

const hbs = require("hbs");
const app = express();

app.use(express.static('public'));
// o((>ω< ))o                                    ( ͡° ͜ʖ ͡°)

const port = 3000;
// #4 hbs conf
const path = require('path');

var logged_user = "Not logged in";
//var logged_user = "AdminGuy";
module.exports.getLogged_user = function () {
	return logged_user;
};

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
// ┳━┳ ノ( ゜-゜ノ)                             ( ͡° ͜ʖ ͡°)
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



// ---------CONTROLLERS------------

const homeRouter = require('./routes/homeRouter.js');
app.use('/', homeRouter);

const addBookRouter = require('./routes/addBookRouter.js');
app.use('/', addBookRouter);

const bookRouter = require('./routes/bookRouter.js');
app.use('/', bookRouter);

const editBookRouter = require('./routes/editBookRouter.js');
app.use('/', editBookRouter);

const genresRouter = require('./routes/genresRouter.js');
app.use('/', genresRouter);

const registrationRouter = require('./routes/registrationRouter.js');
app.use('/', registrationRouter);

const shoppingCartRouter = require('./routes/shoppingCartRouter.js');
app.use('/', shoppingCartRouter);

const searchPageRouter = require('./routes/searchPageRouter.js');
app.use('/', searchPageRouter);

const ordersRouter = require('./routes/ordersRouter.js');
app.use('/', ordersRouter);

const accepted_ordersRouter = require('./routes/accepted_ordersRouter.js');
app.use('/', accepted_ordersRouter);

const wishListRouter = require('./routes/wishListRouter.js');
app.use('/', wishListRouter);

const loginRouter = require('./routes/loginRouter.js');
app.use('/', loginRouter);

// <<<-------CONTROLLERS-----------

app.get('/', (_, response) => {
	response.redirect('home');
});

app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});




//-----------EXPORTS-------------

exports.setLogged_user = function(str) { //idk how this works
	logged_user = str;
}

exports.fillHeader = async function() {
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
	console.log(logged_user);
}

exports.removeEmptyBookTags = async function (){
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

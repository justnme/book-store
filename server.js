
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

const express = require('express');
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms
const { Op } = require("sequelize"); //needed for sequelize operators

const hbs = require("hbs");
const app = express();
const port = 3000;
// #4 hbs conf
const path = require('path');

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
	user_id: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	status_text: {
		type: Sequelize.STRING,
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
	response.render('registration');
  });
  app.get('/book', (_, response) => {
	response.render('book');
  });
  
app.get('/shoppingCart', (_, response) => {
	response.render('shoppingCart');
  });
//   app.get('/book/id', (_, response) => {
// 	response.render('/book/id');
//   });

app.get('/genres', (_, response) => {
  response.render('genres');
});

app.get('/addBook', (_, response) => {
  response.render('addBook');
});

app.get('/home', async (_, response) => {
	const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); //This is all for book on the home screen
	let result_string = "";
	const result = await Books.max("book_id");
	
	(async function loop() {
		let i = 1;
		while(i <= result) {
			await delay(Math.random() * 10);
			current_book = await Books.findOne({where:{book_id: {[Op.gte]: i}}, raw:true});
			const current_image_name = current_book.image_name;
			result_string = result_string + `<a href="#" class="swiper-slide"><img src="book_images/${current_image_name}" alt=""></a>`;
			i = current_book.book_id + 1;
			console.log(i);
		}
		console.log(result_string);
		await delay(Math.random() * 10);
		await hbs.registerHelper("book_carousel", function(){
			return `${result_string}`;
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

app.post("/upload", upload, (request, response) => {
	if(!request.body) return response.sendStatus(400);

	console.log(request.body);
	console.log(request.file);
	
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
    const login_email = request.body.login_email;
    const login_password = request.body.login_password;
	
	Users.findOne({where:{email: login_email, password_text: login_password}, raw:true})
	.then(users=>{
		if (users == null) {
			hbs.registerHelper("login_result", function(){
				return `The email or password is wrong`;
			});
		}
		else {
			hbs.registerHelper("login_result", function(){
				return ``;
			});
		}
		response.redirect(request.get('referer')); //reload page
	}).catch(err=>console.log(err));
});

app.listen(3000, () => {
    console.log(`Server is listening on localhost:3000`);
});
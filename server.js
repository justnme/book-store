
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());

const express = require('express');
const urlencodedParser = express.urlencoded({extended: false}); //needed for POST forms

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

// let it be array for now
let books = [
  { bookLink: 'book_images', bookCover: 'shadow_and_bone.jpg' },
  { bookLink: 'book_images', bookCover: 'the_maid.jpg' },
  { bookLink: 'book_images', bookCover: 'wish_you_were_here.jpg' },
];

app.get('/', (_, response) => {
	// response.redirect('home'); //I hope this works now
    response.render('index', { books: books });
});

app.get('/home', (_, response) => {
  response.render('index', { books: books });
});

app.get('/genres', (_, response) => {
  response.render('genres', { books: books });
});

app.get('/registration', (_, response) => {
	response.render('registration');
  });
  app.get('/book', (_, response) => {
	response.render('book');
  });
  
//   app.get('/book/id', (_, response) => {
// 	response.render('/book/id');
//   });
  

app.get('/addBook', (_, response) => {
  response.render('addBook');
});


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

// DOESN'T WORK (but it's close though)
/*
hbs.registerHelper("book_carousel", function(){
	let result_string ="";
	
	Books.count()
	.then(result=>{
		for (let i = 1; i <= result; i++){
			const current_book = Books.findByPk(i);
			const current_image_name = current_book.image_name;
			result_string = result_string + `<a href="#" class="swiper-slide"><img src="book_images/${current_image_name}" alt=""></a>`;
		}
		return `${result_string}`;
	}).catch(err=>console.log(err));
});
*/

app.post("/addBook", urlencodedParser, function (request, response) { //Adding book to DB
	if(!request.body) return response.sendStatus(400);
	
	const book_title = request.body.bookTitle;
	const book_genre = request.body.bookGenre;
	const book_image = request.body.bookImage;
	const book_author = request.body.bookAuthor;
	const book_price = request.body.bookPrice;
	const book_date = request.body.bookDate;
	const tags = [];
	
	if(request.body.tags1 != "") tags.push(request.body.tags1);
	if(request.body.tags2 != "") tags.push(request.body.tags2);
	if(request.body.tags3 != "") tags.push(request.body.tags3);
	if(request.body.tags4 != "") tags.push(request.body.tags4);
	if(request.body.tags5 != "") tags.push(request.body.tags5);
	
	Books.findOne({where:{title: book_title}, raw:true})
	.then(book=>{
		if (book != null) {
			//Add something here so that the user knows the book already exists
		}
		else {
			console.log("null");
			
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
							Books.create({genre_id: genre.genre_id, image_name: book_image, author_id: authorId, title: book_title, price: book_price, date: book_date});
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
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/') // Destination folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File name
    }
});

// Initialize upload
const upload = multer({
    storage: storage
}).single('bookImage');

// Route for file upload
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error uploading file');
        } else {
            res.send('File uploaded successfully');
        }
    });
});
app.listen(port, () => {
    console.log(`Server is listening on localhost:${port}`);
});


// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'your_mysql_username',
//     password: 'your_mysql_password',
//     database: 'your_database_name'
//   });
  
//   connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL database: ' + err.stack);
//       return;
//     }
//     console.log('Connected to MySQL database as id ' + connection.threadId);
//   });
  
//   // Close connection
//   // connection.end();

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
	// response.redirect('home');
    response.render('index', { books: books }); //I hope this works now
});

app.get('/home', (_, response) => {
  response.render('index', { books: books });
});

app.get('/genres', (_, response) => {
  response.render('genres', { books: books });
});

app.get('/registration', (_, response) => {
	response.render('registration' );
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
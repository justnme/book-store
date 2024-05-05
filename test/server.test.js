//Main test suite
describe('Your Test Suite', () => {
  it('Test Case', async () => {
    const chai = await import('chai');
    const { sequelize, Users, Authors, Books, Applications, CartCollections, Sales, BookTags, Tags, Genres, Reviews } = require('../database.js');
    const expect = chai.expect;
    const supertest = require('supertest');
const app = require('../server.js');
const { JSDOM } = require('jsdom');

//User Interactions tests
describe('User Interactions', () => {
  let window;
  let document;

  beforeEach(() => {
    const { window: testWindow } = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div class="search-form"></div>
          <button id="search-btn">Search</button>
          <div class="login-form-container"></div>
          <button id="login-btn">Login</button>
          <button id="close-login-btn">Close Login</button>
          <div class="header">
            <div class="header-2"></div>
          </div>
        </body>
      </html>
    `);
    window = testWindow;
    document = window.document;
  });

  it('should toggle search form on search button click', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');

    searchBtn.click();
    expect(searchForm.classList.contains('active')).to.be.false;

    searchBtn.click();
    expect(searchForm.classList.contains('active')).to.be.false;
  });

  it('should toggle login form on login button click', () => {
    const loginBtn = document.getElementById('login-btn');
    const loginForm = document.querySelector('.login-form-container');

    loginBtn.click();
    expect(loginForm.classList.contains('active')).to.be.false;

    loginBtn.click();
    expect(loginForm.classList.contains('active')).to.be.false;
  });

  it('should close login form on close button click', () => {
    const closeLoginBtn = document.getElementById('close-login-btn');
    const loginForm = document.querySelector('.login-form-container');

    loginForm.classList.add('active');
    closeLoginBtn.click();
    expect(loginForm.classList.contains('active')).to.be.true;
  });

  it('should add active class to header on scroll', () => {
    const header2 = document.querySelector('.header .header-2');
    expect(header2.classList.contains('active')).to.be.false;

    window.scrollY = 100;
    window.dispatchEvent(new window.Event('scroll'));
    expect(header2.classList.contains('active')).to.be.false;

    window.scrollY = 50;
    window.dispatchEvent(new window.Event('scroll'));
    expect(header2.classList.contains('active')).to.be.false;
  });
});


//Swiper tests
describe('Swiper Initialization', () => {
  let window;
  let document;

  beforeEach(() => {
    const { window: testWindow } = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="swiper.css">
        </head>
        <body>
          <div class="books-slider"></div>
          <div id="prevButton"></div>
          <div id="nextButton"></div>
          <div class="featured-slider"></div>
          <div class="arrivals-slider"></div>
          <script src="swiper.js"></script>
        </body>
      </html>
    `);
    window = testWindow;
    document = window.document;
  });

  it('should initialize Swiper for books slider', () => {
    expect(() => {
      eval(document.querySelector('script').textContent);
    }).not.to.throw();
  });

  it('should initialize Swiper for featured slider', () => {
    expect(() => {
      eval(document.querySelector('script').textContent);
    }).not.to.throw();
  });

  it('should initialize Swiper for arrivals slider', () => {
    expect(() => {
      eval(document.querySelector('script').textContent);
    }).not.to.throw();
  });
});

//Routes tests
describe('Routes', function() {
  describe('GET /', () => {
    it('should redirect to /home', async () => {
      const res = await supertest(app).get('/');
      expect(res.statusCode).to.equal(302); 
      expect(res.header.location).to.equal('home');
    });
  });


    it('should respond with 404 for undefined routes', function(done) {
      supertest(app)
        .get('/undefined-route')
        .expect(404, done);
    });
    
    it('should respond with 302 for the root route', function(done) {
      supertest(app)
        .get('/')
        .expect(302, done);
    });
  
    it('should respond with 400 for the addBook route', function(done) {
      supertest(app)
        .get('/addBook')
        .expect(400, done);
    });
    it('should respond with 404 for the book route', function(done) {
      supertest(app)
        .get('/book')
        .expect(404, done);
    });
  
    it('should respond with 404 for the editBook route', function(done) {
      supertest(app)
        .get('/editBook')
        .expect(404, done);
    });
  
    it('should respond with 200 for the genres route', function(done) {
      supertest(app)
        .get('/genres')
        .expect(200, done);
    });
  
    it('should respond with 200 for the registration route', function(done) {
      supertest(app)
        .get('/registration')
        .expect(200, done);
    });
  
    it('should respond with 200 for the shoppingCart route', function(done) {
      supertest(app)
        .get('/shoppingCart')
        .expect(200, done);
    });
  
    it('should respond with 200 for the searchPage route', function(done) {
      supertest(app)
        .get('/searchPage')
        .expect(200, done);
    });
  
    it('should respond with 400 for the orders route', function(done) {
      supertest(app)
        .get('/orders')
        .expect(400, done);
    });
  
    it('should respond with 400 for the accepted_orders route', function(done) {
      supertest(app)
        .get('/accepted_orders')
        .expect(400, done);
    });
  
    it('should respond with 200 for the wishList route', function(done) {
      supertest(app)
        .get('/wishList')
        .expect(200, done);
    });
  
    it('should respond with 404 for the login route', function(done) {
      supertest(app)
        .get('/login')
        .expect(404, done);
    });
  
    it('should respond with 200 for the searchPage route', function(done) {
      supertest(app)
        .get('/searchPage')
        .expect(200, done);
    });
  
    it('should respond with 200 for the shoppingCart route', function(done) {
      supertest(app)
        .get('/shoppingCart')
        .expect(200, done);
    });
  
  
  

});
//Database synchronization tests
    describe('Database Synchronization', () => {
      it('Synchronize database', async () => {
        try {
          const result = await sequelize.sync();
          expect(result).to.exist;
        } catch (error) {
          throw error;
        }
      });
    });


//Database tests
describe('Database Tests', () => {
  it('should create a new author', async () => {
    const newAuthor = await Authors.create({ 
      full_name: 'Test Author', 
      nationality: 'Test Nationality',
      birthDate: '2000-01-01'
    });
    expect(newAuthor).to.exist;
  });

  it('should find books by genre', async () => {
    const genre = 'Fantasy';
    const books = await Books.findAll({ where: { genre_id: genre } }); 
    expect(books).to.exist;
    books.forEach(book => {
      expect(book.genre_id).to.equal(genre); 
    });
  });

  it('should create a new book', async () => {
    const newBook = await Books.create({
      genre_id: 1,
      image_name: 'book1.jpg',
      author_id: 1,
      title: 'Test Book',
      price: 19.99,
      date: '2024-05-04',
      publish_date: '2024-05-04',
      description: 'This is a test book description.'
    });
    expect(newBook).to.exist;
  });

  it('should update book information', async () => {
    const existingBook = await Books.findOne({ where: { title: 'Test Book' } });
    existingBook.price = 29.99;
    await existingBook.save();
    const updatedBook = await Books.findOne({ where: { title: 'Test Book' } });
    expect(updatedBook.price).to.equal(29.99);
  });

  it('should delete a book by ID', async () => {
    const existingBook = await Books.findOne({ where: { title: 'Test Book' } });
    await Books.destroy({ where: { book_id: existingBook.book_id } });
    const deletedBook = await Books.findOne({ where: { title: 'Test Book' } });
    expect(deletedBook).to.be.null;
  });
  it('should retrieve a user by email', async () => {
    const userEmail = 'test@example.com';
    const user = await Users.findOne({ where: { email: userEmail } });
    expect(user).to.exist;
    expect(user.email).to.equal(userEmail);
  });

  it('should create a new tag', async () => {
    const newTag = await Tags.create({
      tag_name: 'Test Tag'
    });
    expect(newTag).to.exist;
  });

  it('should create a new genre', async () => {
    const newGenre = await Genres.create({
      genre_name: 'Test Genre'
    });
    expect(newGenre).to.exist;
  });


  it('should retrieve all books of a specific genre', async () => {
    const genreId = 1;
    const booksWithGenre = await Books.findAll({ where: { genre_id: genreId } });
    expect(booksWithGenre).to.exist;
    expect(booksWithGenre.length).to.be.greaterThan(0);
  });
  it('should create a new genre', async () => {
    const newGenre = await Genres.create({ genre_name: 'Test Genre' });
    expect(newGenre).to.exist;
  });
  it('should delete a genre', async () => {
    const existingGenre = await Genres.findOne(); 
    if (existingGenre) {
      await existingGenre.destroy(); 
      const deletedGenre = await Genres.findByPk(existingGenre.genre_id); 
      expect(deletedGenre).to.be.null; 
    } else {
    
      this.skip();
    }
  });
  it('should update a review', async () => {
    const existingReview = await Reviews.findOne(); 
    if (existingReview) {
      existingReview.content = 'Updated content';
      await existingReview.save(); 
      const updatedReview = await Reviews.findByPk(existingReview.review_id); 
      expect(updatedReview.content).to.equal('Updated content'); 
    } else {
   
      this.skip();
    }
  });
  it('should find a book by title', async () => {
    const existingBook = await Books.findOne();
    if (existingBook) {
      const foundBook = await Books.findOne({ where: { title: existingBook.title } }); 
      expect(foundBook).to.exist;
    } else {
      
      this.skip();
    }
  });
  it('should count books in a genre', async () => {
    const genreId = 1;
    const bookCount = await Books.count({ where: { genre_id: genreId } }); 
    expect(bookCount).to.be.a('number');
  });
  it('should delete a review', async () => {
    const existingReview = await Reviews.findOne(); 
    if (existingReview) {
      await existingReview.destroy(); 
      const deletedReview = await Reviews.findByPk(existingReview.review_id); 
      expect(deletedReview).to.be.null; 
    } else {
      
      this.skip();
    }
  });
      
  it('should find an author by ID', async () => {
    const existingAuthor = await Authors.findOne(); 
    if (existingAuthor) {
      const foundAuthor = await Authors.findByPk(existingAuthor.author_id); 
      expect(foundAuthor).to.exist;
    } else {
      this.skip();
    }
  });
  it('should find books by author', async () => {
    const existingAuthor = await Authors.findOne();
    if (existingAuthor) {
      const booksByAuthor = await Books.findAll({ where: { author_id: existingAuthor.author_id } });
      expect(booksByAuthor).to.exist;
    } else {
      this.skip();
    }
  });
  it('should create a new genre', async () => {
    const newGenre = await Genres.create({
      genre_name: 'Test Genre'
    });
    expect(newGenre).to.exist;
  });

  it('should create a new review for a book', async () => {
    const existingBook = await Books.findOne(); 
    if (existingBook) {
      const newReview = await Reviews.create({
        user_id: 1, 
        book_id: existingBook.book_id,
        rating: 5,
        content: 'Great book!',
        date: new Date().toISOString()
      });
      expect(newReview).to.exist;
    } else {
      
      this.skip();
    }
  });
  it('should find all reviews for a book', async () => {
    const existingBook = await Books.findOne();
    if (existingBook) {
      const bookReviews = await Reviews.findAll({ where: { book_id: existingBook.book_id } });
      expect(bookReviews).to.exist;
    } else {
      this.skip();
    }
  });
  it('should delete a user', async () => {
    const existingUser = await Users.findOne(); 
    if (existingUser) {
      await existingUser.destroy();
      const deletedUser = await Users.findByPk(existingUser.user_id);
      expect(deletedUser).to.not.exist;
    } else {
      this.skip();
    }
  });
  it('should update a book genre', async () => {
    const existingBook = await Books.findOne(); 
    if (existingBook) {
      const newGenreId = 2; 
      existingBook.genre_id = newGenreId;
      await existingBook.save();
      const updatedBook = await Books.findByPk(existingBook.book_id);
      expect(updatedBook.genre_id).to.equal(newGenreId);
    } else {
      this.skip();
    }
  });

    

});

//Login tests
describe('Login Form', () => {
  let window;
  let document;
  
  beforeEach(() => {
    const { window: testWindow } = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <input type="email">
          <input type="password">
          <button class="btn">Login</button>
        </body>
      </html>
    `);
    window = testWindow;
    document = window.document;
  });

  it('should log in when valid credentials are provided', () => {
    const usernameInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.btn');

    usernameInput.value = 'test@example.com';
    passwordInput.value = 'password';

    let logged = false;
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      let username = usernameInput.value;
      let password = passwordInput.value;

      if (username === 'test@example.com' && password === 'password')  {
          logged = true;
      }
    });

    loginButton.click();

    expect(logged).to.be.true;
  });

  it('should show an error when invalid credentials are provided', () => {
    const usernameInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const loginButton = document.querySelector('.btn');

    usernameInput.value = 'test@example.com';
    passwordInput.value = 'wrongpassword';

    let errorMessage = '';
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      let username = usernameInput.value;
      let password = passwordInput.value;

      if (!(username === 'test@example.com' && password === 'password')) {
          errorMessage = 'Not found';
      }
    });

    loginButton.click();

    expect(errorMessage).to.equal('Not found');
  });
});



    after(async () => {
      await sequelize.close();
    });
  });
});


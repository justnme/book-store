const Sequelize = require("sequelize");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "bookStore.db",
	define: {
		timestamps: false
	}
});

const Book = sequelize.define('Book', {
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

module.exports = Book;

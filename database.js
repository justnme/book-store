

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
	publish_date: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	description: {
		type: Sequelize.TEXT,
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
	cartCollection_id: {
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

module.exports = {
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
};
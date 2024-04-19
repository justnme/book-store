
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
const express = require('express');
const hbs = require("hbs");
const app = express();
const port = 3000;

// #4 hbs conf
const path = require('path');

app.set("view engine", "hbs"); 
app.set("views", __dirname + "/views"); 

// #4 hbs conf
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(express.static(__dirname)); 

app.get("/", (_, response) => {
    response.render("index"); 
});

app.get("/home", (_, response) => {
    response.render("index");
});

app.get("/genres", (_, response) => {
    response.render("genres"); 
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
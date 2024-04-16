
// for mysql
// const mysql = require('mysql');

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
const express = require('express');
const hbs = require("hbs");
const app = express();
const port = 3000;

app.set("view engine", "hbs"); // Install hbs
app.set("views", __dirname + "/views"); // Set views directory

app.use(express.static(__dirname)); // Set the default directory path to serve static files

app.get("/", (_, response) => {
    response.render("index"); // Render views/index.hbs
});

app.get("/home", (_, response) => {
    response.render("index"); // Render views/index.hbs
});

app.get("/genres", (_, response) => {
    response.render("genres"); // Render views/genres.hbs
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
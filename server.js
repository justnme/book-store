const express = require('express');
const hbs = require("hbs");
// for mysql
const mysql = require('mysql');

const app = express();
const port = 3000;

//const bodyParser = require('body-parser');
//app.use(bodyParser.json());
app.use(express.json());

app.use(express.static(__dirname)); //Set the default directory path to "book-store-main"

app.set("view engine", "hbs"); //Install hbs

app.get("/", function (_, response) { //Making it so localhost:3000 is turned into localhost:3000/home
    response.sendFile(__dirname + "/index.hbs");
});

app.use("/home", function(request, response){ //show hbs files
    response.render("index.hbs");
});

app.use("/genres", function(request, response){
    response.render("genres.hbs");
});

app.get('/', (req, res) => {
	console.log('Listening!');
});

app.listen(port, () => {
	console.log(`Server is listening on localhost:${port}`);
});


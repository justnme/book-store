const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('Listening!');
  });

  app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
  });
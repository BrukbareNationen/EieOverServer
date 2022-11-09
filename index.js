const express = require('express');

const app = express();

//ROUTES
app.get('/', (req, res) => {
  res.send('Server nr 2');
})

app.listen(3300);
const express = require('express');
const axios = require('axios');
const sf = require('./scheduledFunctions/timing.js');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const Sales = require('./models/Sales');
const w = require('./writeFromApi');
//config
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set("port", process.env.PORT || 3300);

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ADD CALL to execute your function(s)
sf.initScheduledJobs();

//import routes
const salesRoute = require('./routes/sales');
const { moranIndex } = require('@turf/turf');
app.use('/sales', salesRoute);



//ROUTES
app.get('/', (req, res) => {
  res.send('woop');
})

app.get('/load', async (req, res) => {
    let allSales = await w.main();
    //let allJSON = await JSON.stringify(allSales);

   
    //await Sales.insertMany(allSales);

   res.send(allSales.length + "asdqwd")
})

app.get('/slack', (req, res) => {
  res.render('index.ejs');
})

app.post('/form-submit', (req, res) => {
    axios.post('https://hooks.slack.com/services/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', {
      text: `Navn: ${req.body.name} sier ${req.body.message}`
    }).then(() => {res.send('Melding sendt')}).catch(() => {res.send('Melding feilet')})
})

//connect to DB
mongoose.connect(process.env.DB_CONNECTION, 
            () => {console.log('connected to db');
          })

app.listen(3300, () => {
  console.log("Express server listening on port " + app.get("port"));
});
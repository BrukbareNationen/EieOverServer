const express = require('express');

const fs = require('fs');
const sf = require('./scheduledFunctions/timing.js');
const mongoose = require('mongoose');
require('dotenv/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const w = require('./writeFromApi');

//config
const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');
app.set("port", process.env.PORT || 3300);

app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// kjører Cron-filen som inneholder cron-jobbene
sf.initScheduledJobs();

//import routes
const salesRoute = require('./routes/sales');
app.use('/sales', salesRoute);

//ROUTES
app.get('/', (req, res) => {
  res.send('woop');
})

//Laster inn eiendomsdata fra Amedia og skriver til fil
app.get('/load', async (req, res) => {

  //dagens dato til riktig format yyyy-mm-dd
  let today = new Date();
  let toDate = today.toISOString().slice(0, 10);

  //60 dager siden riktig format yyyy-mm-dd
  let c = new Date();
  c.setDate(c.getDate() - 60);
  let fromDate =  c.toISOString().slice(0, 10);
  
  let sales = await w.loadDataFromAmedia(fromDate, toDate);    

  // Skriv til databasen
  //await Sales.insertMany(allSales);

  let salesJSON = JSON.stringify(sales);
  fs.writeFileSync('./public/sales.json', salesJSON);

  res.send("Henter fra " + fromDate + " til " + toDate +" og legnden er " + sales.length)
})

//connect to DB
mongoose.connect(process.env.DB_CONNECTION, 
            () => {console.log('connected to db');
          })

app.listen(3300, () => {
  console.log("Express server listening on port " + app.get("port"));
});

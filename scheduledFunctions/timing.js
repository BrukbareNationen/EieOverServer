const CronJob = require("node-cron");
const w = require('../writeFromApi');
const fs = require('fs');
const { log } = require("console");
const { stringify } = require("querystring");
const axios = require('axios')



exports.initScheduledJobs = async () => {
  const scheduledJobFunction = CronJob.schedule("0 */6 * * *", async () => {

    let now = new Date();
    
    //w.formatDate(Date.now());
    
    console.log("Node-Cron kjører " + now.toLocaleDateString() + " " + now.toLocaleTimeString());
 

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
    console.log("skriver til sales.json");
    sales = [];  
    fs.appendFileSync('./writelog.txt', "\r\nHentet data fra server " +  now + "   -  henter fra " + fromDate + " til " + toDate );
  });

  

  scheduledJobFunction.start();


  // const cronArea = CronJob.schedule("0 */6 * * *", async () => {

  //   // try {
  //   //   let data = await w.getData("http://api.nationen.no/kart/sales.json");

  //   //   for(index = 0; index < 25; index++) {
  //   //     console.log(data[index].date)
  //   //   }
      
      
  //   // } catch(error) {
  //   //   console.log(error);
  //   // }
  //   axios.post('https://hooks.slack.com/services/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', {
  //     text: `Ikke gi opp`
  //   }).then(() => {res.send('Melding sendt')}).catch(() => {res.send('Melding feilet')})
 
  // });
  //cronArea.start();
}





// function padTo2Digits(num) {
//   return num.toString().padStart(2, '0');
// }

// function formatDate(date) {
//   return (
//     [
//       date.getFullYear(),
//       padTo2Digits(date.getMonth() + 1),
//       padTo2Digits(date.getDate()),
//     ].join('-') +
//     ' ' +
//     [
//       padTo2Digits(date.getHours()),
//       padTo2Digits(date.getMinutes()),
//       padTo2Digits(date.getSeconds()),
//     ].join(':')
//   );
// }



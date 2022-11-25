const CronJob = require("node-cron");
const w = require('../writeFromApi');

exports.initScheduledJobs = async () => {
  const scheduledJobFunction = CronJob.schedule("00 07 * * *", async () => {

    
    console.log("I'm executed on a schedule!", formatDate(Date.now()));
    // Add your custom logic here

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
  });

  scheduledJobFunction.start();
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



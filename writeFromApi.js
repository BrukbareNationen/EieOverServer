const fs = require('fs');
const axios = require('axios');
const turf = require('@turf/turf');
const Sales = require('./models/Sales');



const TEST_URL = 'https://services.api.no/api/acies/v1/external/1881/property/?querystring=&filters=PropertyType:Landbruk/fiske,PropertySoldDate:2020-01-01--2022-11-24&fields=*&rows=2000&sortby=propertysolddate%20DESC,saleId%20ASC'
// Use array buffer!

let sales = [];

async function main() {


  let abc = await getData();
  let def = refaktorData(abc)
  return def
}

async function getData() {

  let json = await axios.get(TEST_URL);
  return json.data;
}



// axios.get(TEST_URL,{ responseType:"arraybuffer"})
//     .then(response => {

//         let data = response.data;
//         fs.writeFileSync('./response.json', data);

//     })
//     .catch(err => {
//         console.log(err + " feil 2")
//    })
//.then( data => {
// 	console.log(data, "er det noe data her?")

// });







function refaktorData(data) {
  //  Loop though Hits
  console.log(data.Hits.length, 'response from 1881');


  data.Hits.forEach(d => {
    let id = d.Property.Sale.Id
    let xy = d.Property.StreetAddress.Coordinate ? [d.Property.StreetAddress.Coordinate.Latitude, d.Property.StreetAddress.Coordinate.Longitude] : null
    let address = d.Property.StreetAddress.StreetName ? d.Property.StreetAddress.StreetName + " " + d.Property.StreetAddress.HouseNumber : null
    let mn = d.Property.Sale.NewsletterFormatText.split(";")
    let mnFormat = mn[9] + "-" + mn[10] + "/" + mn[11] + "/" + mn[12] + "/" + mn[13]

    // If sale does not exist, push new sale
    if (!sales.some(s => s.saleId == id)) {
      sales.push({
        saleId: id,
        multiple: false,
        price: d.Property.Sale.Price,
        date: d.Property.Sale.SoldDate,
        type: d.Property.Sale.Type,
        properties: [{
          type: d.Property.BuildingType,
          coordinates: xy,
          address: address,
          municipality: d.Property.StreetAddress.Municipality,
          matrikkelNumber: mnFormat,
          text: {
            line: d.Property.Sale.LineId,
            text: d.Property.Sale.InfoText
          }
        }]
      })
    }

    // If sale exist, push new property
    else {
      let i = sales.findIndex(x => x.saleId == id) // Find SaleId array index
      sales[i].multiple = true;
      sales[i].properties.unshift({
        type: d.Property.BuildingType,
        coordinates: xy,
        address: address,
        municipality: d.Property.StreetAddress.Municipality,
        matrikkelNumber: mnFormat,
        text: {
          line: d.Property.Sale.LineId,
          text: d.Property.Sale.InfoText
        }
      })
    }
  })

  let salesJSON = JSON.stringify(sales);
  console.log(sales.length, 'formatert data');

  fs.writeFileSync('./public/sales.json', salesJSON);
  //Sales.insertMany(sales);
  return sales
  // return salesJSON
}






module.exports = { main }
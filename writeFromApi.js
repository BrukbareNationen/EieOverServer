const fs = require('fs');
const axios = require('axios');
const turf = require('@turf/turf');
const Sales = require('./models/Sales');




// Use array buffer!

let sales = [];
async function loadDataFromAmedia(fromDate, toDate) {  
  let API_URL = `https://services.api.no/api/acies/v1/external/1881/property/?querystring=&filters=PropertyType:Landbruk/fiske,PropertySoldDate:${fromDate}--${toDate}&fields=*&rows=3000&sortby=propertysolddate%20DESC,saleId%20ASC`;
   let abc = await getData(TEST_URL);
  let def = refaktorData(abc)
  return def
}

async function getData(url) {

  let json = await axios.get(url);
  return json.data;
}




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
          isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
          type: d.Property.BuildingType,
          coordinates: xy,
          address: address,
          municipality: d.Property.StreetAddress.Municipality,
          matrikkelNumber: mnFormat,
          text: d.Property.Sale.InfoText
          
        }]
      })
    }

    // If sale exist, push new property
    else {
      let i = sales.findIndex(x => x.saleId == id) // Find SaleId array index
      sales[i].multiple = true;
      sales[i].properties.unshift({
        isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
        type: d.Property.BuildingType,
        coordinates: xy,
        address: address,
        municipality: d.Property.StreetAddress.Municipality,
        matrikkelNumber: mnFormat,
        text: d.Property.Sale.InfoText        
      })
    }
  })

  
  console.log(sales.length, 'formatert data');
  
  //Sales.insertMany(sales);
  return sales
  // return salesJSON
}






module.exports = { loadDataFromAmedia }
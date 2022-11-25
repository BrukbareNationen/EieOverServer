const fs = require('fs');
const axios = require('axios');
const turf = require('@turf/turf');
const Sales = require('./models/Sales');

const { JSDOM } = require("jsdom");
const { window } = new JSDOM();

const TEST_URL = 'https://services.api.no/api/acies/v1/external/1881/property/?querystring=&filters=PropertyType:Landbruk/fiske,PropertySoldDate:2020-01-01--2022-24-11&fields=*&rows=10000&sortby=propertysolddate%20DESC,saleId%20ASC'
// Use array buffer!

let sales = [];

async function main() {
  
  
  let abc = await getData();
  refaktorData(abc)
}

async function getData () {

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







function refaktorData (data) {
  //  Loop though Hits
  data.Hits.forEach(d => {
    let id = d.Property.Sale.Id
    // Coordinate function
    let xy = (d.Property.StreetAddress.Coordinate) ? [d.Property.StreetAddress.Coordinate.Latitude, d.Property.StreetAddress.Coordinate.Longitude] : null
    // Get Matrikkelnummer in right format
    let mn = d.Property.Sale.NewsletterFormatText.split(";")
    let mnFormat = mn[9] + "-" + mn[10] + "/" + mn[11] + "/" + mn[12] + "/" + mn[13]

    // If sale does not exist, push new sale
    if (!sales.some(d => d.SaleId == id)) {
      sales.push({
        saleId: id,
        price: d.Property.Sale.Price,
        date: d.Property.Sale.SoldDate,
        type: d.Property.Sale.Type,
        properties: [{
          type: d.Property.BuildingType,
          coordinates: xy,
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
      let i = sales.findIndex(x => x.SaleId == id) // Find SaleId array index
      sales[i].properties.unshift({
        type: d.Property.BuildingType,
        coordinates: xy,
        matrikkelNumber: mnFormat,
        text: {
          line: d.Property.Sale.LineId,
          text: d.Property.Sale.InfoText
        }
      })
    }
  })

  // Get centroid point or single coordinates AND summarize text
  sales.forEach(sale => {
    // Multiple properties
    if (sale.properties.length > 1) {
      // Declare multiple
      sale.Multiple = true
      // Make centroid and text
      let xys = []
      let txt = ""
      sale.properties.forEach(prop => {
        if (prop.coordinates != null) xys.push(prop.coordinates)
        txt += (prop.Text.Text)
      })
      sale.Text = txt
      if (xys.length > 1) {
        let feature = turf.points(xys)
        let latLng = turf.center(feature);
        sale.coordinates = [latLng.lat, latLng.lng]
      }
      // Fallback if only one property has coordinates
      else sale.coordinates = xys[0]
    }
    // Single property
    else {
      sale.multiple = false
      sale.coordinates = sale.properties[0].coordinates
      sale.text = sale.properties[0].text.text
    }
  })

  salesJSON = JSON.stringify(sales)
  console.log(sales.length);
  //fs.writeFileSync('./sales.json', salesJSON);
  Sales.insertMany(sales);
  return sales
  // return salesJSON
}






module.exports = { main }
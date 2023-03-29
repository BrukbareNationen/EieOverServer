const axios = require('axios');

async function loadDataFromAmedia(fromDate, toDate) {  
  let API_URL = `https://services.api.no/api/acies/v1/external/1881/property/?querystring=&filters=PropertyType:Landbruk/fiske,PropertySoldDate:${fromDate}--${toDate}&fields=*&rows=3000&sortby=propertysolddate%20DESC,saleId%20ASC`;
   
  let salesArr = await getData(API_URL);
  let def = refaktorData(salesArr)
  return def
}

async function getData(url) {

  let json = await axios.get(url);
  return json.data;
}

function refaktorData(data) {

  let sales = [];
  //  Loop though Hits
  console.log(data.Hits.length, 'response from 1881');


  data.Hits.forEach(d => {
    if(d.Property.Sale.Type == "Uskiftebevilling") return // tar ikke med uskiftebevilling
   
    let id = d.Property.Sale.Id
    let xy = d.Property.StreetAddress.Coordinate ? [d.Property.StreetAddress.Coordinate.Latitude, d.Property.StreetAddress.Coordinate.Longitude] : null
    let address = d.Property.StreetAddress.StreetName ? d.Property.StreetAddress.StreetName + " " + d.Property.StreetAddress.HouseNumber : null
    let mn = d.Property.Sale.NewsletterFormatText.split(";")
    let mnFormat = mn[9] + "-" + mn[10] + "/" + mn[11] + "/" + mn[12] + "/" + mn[13]
    let fromTo;

    if(d.Property.Sale.LineId === 1) {
      fromTo = getFromTo(d.Property.Sale.InfoText)
    }
    
   
    // If sale does not exist, push new sale
    if (!sales.some(s => s.saleId == id)) {

      
      
      let date = new Date(d.Property.Sale.SoldDate).toLocaleDateString()

      let sale =({
        saleId: id,
        multiple: false,
        price: d.Property.Sale.Price,
        date: date,
        type: d.Property.Sale.Type,  
        fromto: "",      
        prop: [{
          isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
          type: d.Property.BuildingType,
          coord: xy,
          address: address,
          municipality: d.Property.StreetAddress.Municipality,
          matNumb: mnFormat
          //text: d.Property.Sale.InfoText,          
        }]       
      })

      if (d.Property.Sale.LineId === 1) {sale.fromto = fromTo  }

      sales.push(sale);
      
    }

    // If sale exist, push new property
    else {

      
      let i = sales.findIndex(x => x.saleId == id) // Find SaleId array index
      sales[i].multiple = true;
      sales[i].prop.unshift({
        isPartOf: d.Property.Sale.InfoText.includes("ndel av") ? true : false,
        type: d.Property.BuildingType,
        coord: xy,
        address: address,
        municipality: d.Property.StreetAddress.Municipality,
        matNumb: mnFormat                  
      })

      if (d.Property.Sale.LineId === 1) {
        sales[i].fromto = fromTo 
      }
      
    }
  })

  
  console.log(sales.length, 'formatert data');
  
  //Sales.insertMany(sales);
  return sales
  // return salesJSON
}

function getFromTo(string) {
  let fromTo = string.substring((string.indexOf(" fra ") + 5)).split(" til ")

  let fromToArr = [fromTo[0], fromTo[1].substring(0, (fromTo[1].indexOf("(") - 1)) ]
 // return { from: fromTo[0], to:  fromTo[1].substring(0, (fromTo[1].indexOf("(") - 1)) }
 return fromToArr
}

module.exports = { loadDataFromAmedia, getData}
const axios = require('axios');
const turf = require('@turf/turf');
const w = require('./writeFromApi')

const checkSize = 50;   //Velger antallet av de siste salgene man skal søke igjennom
const AREA_SIZE = 10000 // min størrelse av tomstørrelse(dekar) for varsling
let areaArr = [];


async function checkArea () {     // Henter alle salgene siste 60 dager. Henter matrikkeldata og kjører arealberegning på antallet i checkSize

  let sales;  
  // henter alle salg
  try {
    sales = await w.getData("http://api.nationen.no/kart/sales.json");
  } catch(error) {
    console.log(error);
  }

  //looper igjennom alle salgene og så alle eiendommer pr salg
  for(i = 0; i<checkSize; i++) {
    p = sales[i].prop;   
    for(j=0; j < p.length; j++) {
      s = p[j]
      let url = "https://ws.geonorge.no/eiendom/v1/geokoding?matrikkelnummer=" + s.matNumb + "&omrade=true&utkoordsys=4326"
      let areaCoords = await axiosGet(url)     // henter matrikkeldata for hver eiendom
     
      getArea(areaCoords);      // legger alle eiendommer over en viss størrelse inn i areaArr[]
    }
  }

  console.log(areaArr);

  // sender post til slack api med melding
  axios.post('https://hooks.slack.com/services/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', {
      text: `Det er ${areaArr.length} eiendommer som er solgt med areal større enn 1000dekar. ${sales[0].date} er siste dato sjekket`
    }).then(() => {console.log(`Melding sendt ${areaArr.length}`)}).catch(() => {console.log('Melding feilet')})

}

// henter areal pr matrikkelnummer og legger de over en hvis størrelse i areaArr
async function getArea(areaCoords) {
  let area;
  
  if(areaCoords.data.features.length > 0) {
    let info = areaCoords.data.features[0].properties;
    area = Math.round(turf.area(areaCoords.data)/1000) 
    matrikkel = info.kommunenummer + "-" +info.matrikkelnummertekst               
  }

  if(area > AREA_SIZE) areaArr.push(matrikkel)
}

async function axiosGet(url) {
  let res = await axios.get(url);
  return res;
}

// checkArea();


module.exports = { checkArea }
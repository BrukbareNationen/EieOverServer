
let salesConfig = {
  price: {
    filter: false,
    min: 10000,
    max: 1000000
  },
  type: {
    filter: true,
    type: [ "Fritt salg", "Gave"]
  },
  prop: {
    filter: true,
    type: ["Ubebygget", "Annen bygning."]
  }
}

let filteredSales = [];
let unwanted = [];
const SALES = [
  {
    saleId: 35563703,
    multiple: true,
    price: 0,
    date: "12/13/2022",
    type: "Gave",
    fromto: [
      "Harald Mikal Pettersen",
      "Linda Pettersen Jensen"
    ],
    prop: [
      {
        isPartOf: true,
        type: "Ubebygget",
        coord: [
          69.3181937533486,
          17.9061172713284
        ],
        address: null,
        municipality: "Senja",
        matNumb: "5421-76/30/0/0"
      },
      {
        isPartOf: true,
        type: "Ubebygget",
        coord: [
          69.3214218524678,
          17.8439345515199
        ],
        address: null,
        municipality: "Senja",
        matNumb: "5421-76/31/0/0"
      }
    ]
  },
  {
    saleId: 35563681,
    multiple: false,
    price: 0,
    date: "12/13/2022",
    type: "Gave",
    fromto: [
      "Håkon Austrøne",
      "Roald Helge Rasmussen"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Ubebygget",
        coord: [
          68.8903829377979,
          16.4535946211352
        ],
        address: null,
        municipality: "Harstad",
        matNumb: "5402-100/11/0/0"
      }
    ]
  },
  {
    saleId: 35563669,
    multiple: false,
    price: 225000,
    date: "12/13/2022",
    type: "Fritt salg",
    fromto: [
      "Kristin Onsøien",
      "Tore Eugen Johansen"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Annen bygning.",
        coord: [
          63.6779123,
          9.593951
        ],
        address: "Grandveien 334",
        municipality: "Ørland",
        matNumb: "5057-164/116/0/0"
      }
    ]
  },
  {
    saleId: 35563654,
    multiple: false,
    price: 3751135,
    date: "12/13/2022",
    type: "Gave",
    fromto: [
      "Arve Østbø",
      "Tore Olsen Østbø"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Uoppgitt",
        coord: [
          63.9057091,
          11.3080636
        ],
        address: "Sandvollanvegen 391",
        municipality: "Inderøy",
        matNumb: "5053-123/1/0/0"
      }
    ]
  },
  {
    saleId: 35563629,
    multiple: false,
    price: 0,
    date: "12/13/2022",
    type: "Annen omsetningstype",
    fromto: [
      "Per Elias Saksen",
      "Anita Sjursen"
    ],
    prop: [
      {
        isPartOf: true,
        type: "Annen bygning.",
        coord: [
          64.5545315,
          11.525206
        ],
        address: "Ytterbyvegen 307",
        municipality: "Namsos",
        matNumb: "5007-3/6/0/0"
      }
    ]
  },
  {
    saleId: 35563580,
    multiple: true,
    price: 3800000,
    date: "12/13/2022",
    type: "Gave",
    fromto: [
      "Kåre Skjelanger og Mette H J Skjelanger",
      "Charlotte Skjelanger"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Annen bygning.",
        coord: [
          60.6007026,
          4.9686082
        ],
        address: "Skjelangervegen 983",
        municipality: "Alver",
        matNumb: "4631-355/4/0/0"
      },
      {
        isPartOf: false,
        type: "Annen bygning.",
        coord: [
          60.5999225574807,
          4.96841984021652
        ],
        address: null,
        municipality: "Alver",
        matNumb: "4631-355/47/0/0"
      }
    ]
  },
  {
    saleId: 35563547,
    multiple: true,
    price: 1035000,
    date: "12/13/2022",
    type: "Gave",
    fromto: [
      "Sverre Lillegraven",
      "Ruth Lillegraven og Thomas Ruud Sollien"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Uoppgitt",
        coord: [
          60.5754156496301,
          6.76988280965712
        ],
        address: null,
        municipality: "Voss",
        matNumb: "4621-600/3/0/0"
      },
      {
        isPartOf: false,
        type: "Uoppgitt",
        coord: [
          60.5569214,
          6.7332164
        ],
        address: "Skrivargardsvegen 13",
        municipality: "Voss",
        matNumb: "4621-602/1/0/0"
      }
    ]
  },
  {
    saleId: 35563453,
    multiple: false,
    price: 320000,
    date: "12/13/2022",
    type: "Fritt salg",
    fromto: [
      "Marianne Fløistad",
      "Stian Eltervåg"
    ],
    prop: [
      {
        isPartOf: false,
        type: "Ubebygget",
        coord: [
          58.6139325919926,
          8.98348742195642
        ],
        address: null,
        municipality: "Tvedestrand",
        matNumb: "4213-97/189/0/0"
      }
    ]
  },
  {
    saleId: 35563443,
    multiple: true,
    price: 0,
    date: "12/13/2022",
    type: "Skifteoppgjør",
    fromto: [
      "Sissel Sigfrid Danielsen og Åge Danielsen",
      "Dagfinn Danielsen"
    ],
    prop: [
      {
        isPartOf: true,
        type: "Annen bygning.",
        coord: [
          58.2329594165522,
          6.66717488643038
        ],
        address: null,
        municipality: "Flekkefjord",
        matNumb: "4207-109/143/0/0"
      },
      {
        isPartOf: true,
        type: "Annen bygning.",
        coord: [
          58.2327479496302,
          6.6671965814372
        ],
        address: null,
        municipality: "Flekkefjord",
        matNumb: "4207-109/147/0/0"
      }
    ]
  },
  {
    saleId: 35563428,
    multiple: true,
    price: 0,
    date: "12/13/2022",
    type: "Skifteoppgjør",
    fromto: [
      "Valborg Bessesen",
      "Benthe Bessesen, Camilla Bessesen Jensen og Eirik Bessesen Jensen"
    ],
    prop: [
      {
        isPartOf: true,
        type: "Ubebygget",
        coord: [
          58.0062670464635,
          7.57607460909285
        ],
        address: null,
        municipality: "Lindesnes",
        matNumb: "4205-18/4/0/0"
      },
      {
        isPartOf: true,
        type: "Ubebygget",
        coord: [
          58.003677433521,
          7.57098953920509
        ],
        address: null,
        municipality: "Lindesnes",
        matNumb: "4205-18/33/0/0"
      }
    ]
  }
]

function setConfig() {

  // hent verdiene til filtrene
 // let price = document.querySelector('#id-her').value

  if(price.value != null) {
    salesConfig.price.filter = true;
    salesConfig.price.min = price.value.min;
    salesConfig.price.max = price.value.max
  } else {
    salesConfig.price.filter = false;
  }

  if(salestype.length > 0) {
    salesConfig.type.filter = true;
    salesConfig.type.type = valueArray;
  } else {
    salesConfig.type.filter = false;
  }

  if(proptype.length > 0) {
    salesConfig.prop.filter = true;
    salesConfig.prop.type = valueArray;
  } else {
    salesConfig.prop.filter = false;
  }
}



function filterArr(sales, config) { 
    sales.forEach(sale => {
      let containing = [];

      //filterer på pris
      if(config.price.filter === true) {
        if(sale.price < config.price.min || sales.price > config.price.max) {unwanted.push(sale); return}
      }
      //filtrerer på type salg
      if(config.type.filter == true) {
        if(!config.type.type.includes(sale.type) ) {unwanted.push(sale); return}
      }

      if(config.prop.filter == true) {
        
        sale.prop.forEach( p => {
          if(config.prop.type.includes(p.type) ) containing.push(p.type)
        })

        if (containing.length == 0) return
      }

      console.log(sale.type, sale.price, containing);
      filteredSales.push(sale)
      
    });

    // console.log(unwanted.length);
    // console.log(filteredSales.length);
}

function filter() {
  setConfig()
  filterArr(SALES, salesConfig)
}

console.log(SALES.length);
filterArr(SALES, salesConfig);
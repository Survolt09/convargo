'use strict';

//list of truckers
//useful for ALL 5 exercises
var truckers = [{
  'id': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'name': 'les-routiers-bretons',
  'pricePerKm': 0.05,
  'pricePerVolume': 5
}, {
  'id': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'name': 'geodis',
  'pricePerKm': 0.1,
  'pricePerVolume': 8.5
}, {
  'id': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'name': 'xpo',
  'pricePerKm': 0.10,
  'pricePerVolume': 10
}];

//list of current shippings
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
var deliveries = [{
  'id': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'shipper': 'bio-gourmet',
  'truckerId': 'f944a3ff-591b-4d5b-9b67-c7e08cba9791',
  'distance': 100,
  'volume': 4,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '65203b0a-a864-4dea-81e2-e389515752a8',
  'shipper': 'librairie-lu-cie',
  'truckerId': '165d65ec-5e3f-488e-b371-d56ee100aa58',
  'distance': 650,
  'volume': 12,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}, {
  'id': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'shipper': 'otacos',
  'truckerId': '6e06c9c0-4ab0-4d66-8325-c5fa60187cf8',
  'distance': 1250,
  'volume': 30,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'convargo': 0
  }
}];

//list of actors for payment
//useful from exercise 5
const actors = [{
  'deliveryId': 'bba9500c-fd9e-453f-abf1-4cd8f52af377',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '65203b0a-a864-4dea-81e2-e389515752a8',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'deliveryId': '94dab739-bd93-44c0-9be1-52dd07baa9f6',
  'payment': [{
    'who': 'shipper',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'trucker',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'convargo',
    'type': 'credit',
    'amount': 0
  }]
}];




function Pricing(){
  deliveries.forEach(delivery => {
    var tempTruckerID = delivery.truckerId;
    truckers.forEach(trucker => {
      if (trucker.id == tempTruckerID){
        var distance = delivery.distance*trucker.pricePerKm;
        var volumePrice = delivery.volume*trucker.pricePerVolume;

        if((delivery.volume>5) && (delivery.volume<=10)){
            volumePrice = delivery.volume*trucker.pricePerVolume*0.9; //10% reduction

        }else if ((delivery.volume>10) && (delivery.volume<=25)){
            volumePrice = delivery.volume*trucker.pricePerVolume*0.7;//30% reduction

        }else if (delivery.volume>25){
            volumePrice = delivery.volume*trucker.pricePerVolume*0.5;//50% reduction
        }
        delivery.price = distance + volumePrice;
      }
  }); 
  });
}

function Commission(){

    deliveries.forEach(delivery => {
      //calculate the different commissions
      var convargoGlobalComission = 0.3*delivery.price; 
      var insuranceComission = 0.5*convargoGlobalComission;
      var treasuryComission = delivery.distance/500;
      var convargoComission = convargoGlobalComission-insuranceComission-treasuryComission;

      delivery.commission.insurance = insuranceComission;
      delivery.commission.treasury = treasuryComission;
      delivery.commission.convargo = convargoComission;
      
    });

}


function Deductible (){
  
  deliveries.forEach(delivery => {

    if(delivery.options.deductibleReduction == true){

      var newPriceWithDeductibleOption = delivery.price + delivery.volume; //delivery.volume is equal to the additional charge of 1€/m3.
      delivery.price = newPriceWithDeductibleOption;
      delivery.commission.convargo += delivery.volume;

    }
  });
}

function PayActors(){
  deliveries.forEach(delivery => {
    var tempDeliveryID = delivery.id;
    actors.forEach(actor => {
      if(actor.deliveryId == tempDeliveryID){
        actor.payment.forEach(itemPayment => {
          if(itemPayment.who == "shipper" ){
            itemPayment.amount = delivery.price;
          }
          else if(itemPayment.who == "trucker"){
            var globalCommission = delivery.commission.convargo + //calculate the globalComission without deductible option
                               delivery.commission.insurance+
                               delivery.commission.treasury;
            itemPayment.amount = delivery.price - globalCommission;
          }
          else if(itemPayment.who == "treasury"){
            itemPayment.amount = delivery.commission.treasury;
          }
          else if(itemPayment.who == "insurance"){
            itemPayment.amout = delivery.commission.insurance;
          }
          else if(itemPayment.who == "convargo"){
            itemPayment.amount = delivery.commission.convargo;

          }
        });
      } 
    });
  });
}
 
Pricing(); 
Commission();
Deductible();
PayActors();

console.log(truckers);
console.log(deliveries);
console.log(actors);

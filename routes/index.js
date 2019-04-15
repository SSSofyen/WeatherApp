var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var router = express.Router();

var options = {
  server: {
    socketOptions: {
      connectTimeoutMS: 5000
    }
  }
};
mongoose.connect('mongodb://yoannherlaut:0123456@ds115799.mlab.com:15799/openweathermap', options, function(err) {
  console.log(err);
});

var citySchema = mongoose.Schema({name: String, commentaires: String, min: Number, max: Number, picto1: String, lat:Number, lon:Number});
var cityModel = mongoose.model('cities', citySchema);

router.get('/', function(req, res, next) {

  cityModel.find(function(err, ville) {
    console.log(ville);
    res.render('index', {cityList: ville});
  })
});

router.post('/add-city', function(req, res, next) {

  request("http://api.openweathermap.org/data/2.5/weather?q=" + req.body.city + "&appid=fc07f13e149c30c7f3bc9c87c606a95f&units=metric&lang=fr", function(error, reponse, body) {
    body = JSON.parse(body)

    cityModel.find(function(err, ville) {

      var cityExist = false;
      for (var i = 0; i < ville.length; i++) {
        if (ville[i].name.toLowerCase() == req.body.city.toLowerCase()) {
          cityExist = true;
          res.render('index', {cityList: ville});
        }
      }

      if (cityExist == false) {
        var newCity = new cityModel({
          name: body.name,
          commentaires: body.weather[0].description,
          min: body.main.temp_min,
          max: body.main.temp_max,
          picto1: "http://openweathermap.org/img/w/" + body.weather[0].icon + ".png",
          lat:body.coord.lat,
          lon:body.coord.lon
        })

        newCity.save(function(error, city) {

          console.log("city : ",city);
          cityModel.find(function(err, ville) {
            res.render('index', {cityList: ville});
          })
        })
      }

    })
  })
});

router.get('/delete-city', function(req, res, next) {

  cityModel.remove({
    _id: req.query.position
  }, function(err) {
    cityModel.find(function(err, ville) {
      res.render('index', {cityList: ville});
    })
  })

});

module.exports = router;

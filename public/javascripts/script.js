var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 48.86,
      lng: 2.35
    },
    zoom: 4
  });

  var li = document.getElementsByTagName('li');

  for (var i = 0; i < document.getElementsByTagName('li').length; i++) {

    var marker = new google.maps.Marker({
      position: {
        lat: parseFloat(li[i].dataset.lat),
        lng: parseFloat(li[i].dataset.lon)
      },
      map: map
    });

  }

}

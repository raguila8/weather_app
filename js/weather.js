$(document).ready(function() {
  main();
});

function main() {
  var weather = new Weather();
  weather.updateLocation();
  weather.toggleTempBtn();
}

function Weather() {
  this.region;
  this.lat;
  this.lon;
  this.tempC;
  this.tempF;
  this.description;
  this.icon_path;
  this.main;
  this.units = 'celsius';

  this.updateLocation = function() {
    var self = this;
    $.ajax({
      type: "GET",
      url: "http://ip-api.com/json/",
    }).done(function(data) {
      self.lat = data['lat'];
      self.lon = data['lon'];
      self.updateWeather();
    }).fail(function() {
      var errorMsg = "<h4 class='error'>Could not get your location. Try again.</h4>";
      $('.jumbotron').append(errorMsg);
    });
  };

  this.updateWeather = function() {
    var self = this;
    $.ajax({
      type: "GET",
      url: "http://api.openweathermap.org/data/2.5/weather?lat=" + self.lat + 
            "&lon=" + self.lon + "&units=metric&APPID=d746f54ba4f916644d2f5a51b8fd758e"
    }).done(function(data) {
      self.region = data['name'];
      self.tempC = Math.round(data['main']['temp']);
      self.tempF = Math.round(self.tempC *9.0 / 5 + 32);
      self.description = data['weather'][0]['description'];
      self.icon_path = "images/" + data['weather'][0]['icon'] + ".png";
      self.main = data['weather'][0]['main'].toLowerCase().split(' ').join('_');
      self.updateView();
    }).fail(function() {
      var errorMsg = "<h4 class='error'>Could not get the current weather at your location. Try again.</h4>";
      $('.jumbotron').append(errorMsg);
    });
  };

  this.updateView = function() {
    var self = this;
    self.putRegion();
    self.putTemp();
    self.putDescription();
    self.putIcon();
    self.putBackgroundImg();
  };

  this.putRegion = function() {
    var self = this;
    $('#region').text(self.region);
  };

  this.putTemp = function() {
    var self = this;
    if (self.units == 'celsius') {
      $('#temp').text(self.tempC + " \u00B0C");
    } else {
      $('#temp').text(self.tempF + " \u00B0F");
    }
  };

  this.putDescription = function() {
    var self = this;
    $('#description').text(self.description);
  };

  this.putIcon = function() {
    var self = this;
    var $icon = "<img src='" + self.icon_path + "'>";
    $('.jumbotron').append($icon);
  };

  this.putBackgroundImg = function() {
    var self = this;
    $('.background').css('background-image', "url('images/" + self.main + ".jpeg')");
  };

  this.toggleTempBtn = function() {
    var self = this;
    $('button').on('click', function() {
      self.units = $(this).attr('id');
      self.otherBtn($(this).attr('id')).removeClass('selected');
      $(this).addClass('selected');
      self.putTemp();
    });
  };

  this.otherBtn = function(id) {
    if (id === "celsius") {
      return $('#fahrenheit');
    } else {
      return $('#celsius');
    }
  };
  
}

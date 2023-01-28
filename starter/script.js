var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  cityId: "",
  searchHistory: ['Truro', 'Falmouth', 'Bristol'],
};

// create function to use search box to get id from city.list.json

// get value from search-input
// use if state to compare .name to value
$("#search-button").click(function (e) {
  e.preventDefault();
  getCityId('');
});

function getCityId(name) {
  fetch("./starter/city.list.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var citySearch = $("#search-input").val().toLowerCase();
      name = name.toLowerCase()
      
      for (i = 0; i < data.length; i++) {
        var cityList = data[i].name.toLowerCase();
        if (citySearch === cityList) {
          cityInfo.cityName = data[i].name;
          cityInfo.cityId = data[i].id;
          

          
          

          //$("#history").empty();
        } 
        else if (name === cityList) {
          cityInfo.cityName = data[i].name;
           cityInfo.cityId = data[i].id;
           cityData(cityInfo);
      fiveDayForcast(cityInfo);
     return renderButtons(cityInfo);
        }
      }
      cityInfo.searchHistory.push(cityInfo.cityName);
  
      cityData(cityInfo);
      fiveDayForcast(cityInfo);
      renderButtons(cityInfo);
    });
}

function cityData(cityInfo) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?id=" +
    cityInfo.cityId +
    "&appid=" +
    weatherAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var cityName = response.name;
    var date = moment().format("MMMM Do YYYY");
    var icon = response.weather[0].icon;
    var temp = (response.main.temp - 273.15).toFixed(2) + "°C";
    var humidity = response.main.humidity + "%";
    var windSpeed = (response.wind.speed * 3600) / 1000 + " KPH";
    console.log(cityName, date, icon, temp, humidity, windSpeed)
  });
}

// Search needs to to create a button with the city name that the user can then select to gather data on that city.

// search info needs to store; CITY NAME, DATE, ICON OF WEATHER CONDITIONS, TEMP IN C, HUMIDITY, WIND SPEED
//

// get 5 day forcast info
// display needs to show DATE, ICON OF WEATHER CONDITIONS, TEMP, HUMIDITY

function fiveDayForcast(cityInfo) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    cityInfo.cityId +
    "&appid=" +
    weatherAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    for (i = 0; i < 121; i += 8) {
      var list = response.list[i];
      // figure out 5 day date
      var icon = list.weather[0].icon;
      var temp = (list.main.temp - 273.15).toFixed(2) + "°C";
      var humidity = list.main.humidity + "%";

      console.log(icon, temp, humidity);
    }
  });
}

function renderButtons(cityInfo) {
  $("#history").empty();
  
  for (i = 0; i < cityInfo.searchHistory.length; i++) {
    var button = $("<button>"); 
    button.text(cityInfo.searchHistory[i]);
    button.attr("dataset", cityInfo.searchHistory[i]);
    $("#history").append(button);
    
    button.click(function(e) {
      buttonInfo(e, cityInfo);
    }) 
  }
}

function buttonInfo(e, cityInfo) {
  buttonDataset = e.target.innerText;
  for(i = 0; i < cityInfo.searchHistory.length; i++) {
    if(buttonDataset === cityInfo.searchHistory[i]) {
      console.log("this is button: " + buttonDataset)
      getCityId(buttonDataset);
    }
  }
  
}

renderButtons(cityInfo);
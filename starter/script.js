var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  cityId: "",
  searchHistory: []
};

$(document).ready(function () {
  var storedHistory = JSON.parse(localStorage.getItem("search-history"));
  if (storedHistory !== null) {
    cityInfo.searchHistory = storedHistory;
    renderButtons(cityInfo);
  }
});




// create function to use search box to get id from city.list.json

// get value from search-input
// use if state to compare .name to value
$("#search-button").click(function (e) {
  e.preventDefault();
  var cityName = $("#search-input").val();
//  localStorageToSearchHistory()
  cityInfo.searchHistory.push(cityName);
  console.log(cityInfo.searchHistory)
  cityInfo.cityName = cityName;

  getId(cityInfo);
  localStorage.setItem("search-history", JSON.stringify(cityInfo.searchHistory));

  renderButtons(cityInfo);

});

function renderButtons(cityInfo) {
  
  $("#history").empty();
  //cityInfo.searchHistory = JSON.parse('search-history')
  console.log(cityInfo.searchHistory[1])
  for (i = 0; i < cityInfo.searchHistory.length; i++) {
    var button = $("<button>");
    button.text(cityInfo.searchHistory[i]);
    button.attr("data-name", cityInfo.searchHistory[i]);
    button.addClass('btn btn-outline-dark');
    $("#history").append(button);

    button.click(function (e) {
      var buttonDataName = e.target.dataset.name;
      cityInfo.cityName = buttonDataName;

      getId(cityInfo);
      renderButtons(cityInfo);
      localStorage.setItem("search-history", JSON.stringify(cityInfo.searchHistory));

      buttonData(e, cityInfo);
    });
  }
  cityData(cityInfo);
  fiveDayForcast(cityInfo);
}

function buttonData(e, cityInfo) {
  for (i = 0; i < cityInfo.searchHistory.length; i++) {
    buttonDataName = e.target.dataset.name;
    if (buttonDataName === cityInfo.searchHistory[i]) {
      getId(cityInfo);
    }
  }
}

function getId(cityInfo) {
  fetch("./starter/city.list.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (i = 0; i < data.length; i++) {
        var cityData = data[i].name;
        if (cityData === cityInfo.cityName) {
          cityInfo.cityId = data[i].id;
        }
      }
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
    console.log(cityName)
    var date = moment().format("MMMM Do YYYY");
    var icon = response.weather[0].icon;
    var temp = `Temperature: ${(response.main.temp - 273.15).toFixed(2)}°C`;
    var humidity = `Humidity: ${response.main.humidity}%`;
    var windSpeed = `Wind speed: ${(response.wind.speed * 3600) / 1000} KPH`;

   // console.log(cityName, date, icon, temp, humidity, windSpeed);

    var cityInfoHeader = $('<h1>').text(`${cityName} ${date} ${icon}`);
    var tempInfo = $('<p>').text(temp);
    var windInfo = $('<p>').text(windSpeed);
    var humidityInfo = $('<p>').text(humidity);

    $('#today').empty();
    $('#today').addClass('border')
    $('#today').append(cityInfoHeader)
    $('#today').append(tempInfo)
    $('#today').append(windInfo)

    $('#today').append(humidityInfo)



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
    $('#forecast').empty();
    for (i = 0; i < 121; i += 8) {
      var list = response.list[i];
      // figure out 5 day date
      var date = moment().format("MMMM Do YYYY");
      var icon = list.weather[0].icon;
      var temp = (list.main.temp - 273.15).toFixed(2) + "°C";
      var humidity = list.main.humidity + "%";

     // console.log(icon, temp, humidity);

      var forecastDiv = $('<div>');
      forecastDiv.attr('class', "forecast-div")

      

      var forecastHeader = $('<h3>').text(date);
      var iconInfo = $('<p>').text(icon);      
      var tempInfo = $('<p>').text(temp);     
      var humidityInfo = $('<p>').text(humidity); 

      forecastDiv.append(forecastHeader)
      forecastDiv.append(iconInfo)
      forecastDiv.append(tempInfo)
      forecastDiv.append(humidityInfo)
     

      $('#forecast').append(forecastDiv)

    }
  });
}

renderButtons(cityInfo);

// RENDER ELEMENTS TO THE DOM
// USE LOCALSTORAGE TO SAVE SEARCH HISTORY
// 5 DAY FORCAST FIX DATES

// var storage = localStorage.getItem('search-history')
// console.log(storage



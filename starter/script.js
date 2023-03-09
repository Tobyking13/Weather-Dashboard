var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8"; 
var cityInfo = {
  cityName: "",
  cityId: "",
  searchHistory: [],
  cityValid: undefined
};

$(document).ready(function () { 
  var storedHistory = JSON.parse(localStorage.getItem("search-history")); 
  if (storedHistory !== null) { 
    cityInfo.searchHistory = storedHistory; 
    renderButtons(cityInfo); 
  }
});

$("#search-button").click(function (e) {
  e.preventDefault();  
  //$('#display').text("")
  var cityName = $("#search-input").val();  
  let cityNameArr = [];
  cityName = cityName.toLowerCase().split(' ');
  for(let i = 0; i < cityName.length; i++) {  
    cityNameArr.push(cityName[i].charAt(0).toUpperCase() + cityName[i].slice(1));
  }
  
  cityName = cityNameArr.join(' ');
  cityInfo.cityName = cityName; 

  for(let i = 0; i < cityInfo.searchHistory.length; i++) {
    if(cityName === cityInfo.searchHistory[i]) {
      currentForecast(cityInfo);
      fiveDayForecast(cityInfo);
      return;
    }
  }

  cityInfo.searchHistory.push(cityName); 
  localStorage.setItem(
    "search-history",
    JSON.stringify(cityInfo.searchHistory)
  );
  renderButtons(cityInfo); 
});


function renderButtons(cityInfo) {
  $("#history").empty();
  for (i = 0; i < cityInfo.searchHistory.length; i++) {
    var button = $("<button>");
    button.text(cityInfo.searchHistory[i]);
  
    button.attr("data-name", cityInfo.searchHistory[i]);
    button.addClass("btn btn-outline-dark");
    
      $("#history").append(button);

    button.click(function (e) {
      var buttonDataName = e.target.dataset.name;
      cityInfo.cityName = buttonDataName;
      renderButtons(cityInfo);
      localStorage.setItem(
        "search-history",
        JSON.stringify(cityInfo.searchHistory)
      );
    });
  }
  buttonClick(cityInfo);
}

function buttonClick(cityInfo) {
  if(cityInfo.cityName === "") {
    return;
  }
  currentForecast(cityInfo);
  fiveDayForecast(cityInfo);
}

function currentForecast(cityInfo) {
  var queryURL =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  cityInfo.cityName +
  "&appid=" +
  weatherAPIKey;

$.ajax({
  url: queryURL,
  method: "GET",
}).done(function() {
  cityInfo.cityValid = true;
}).fail(function() {
  cityInfo.cityValid = false;
  cityValidity(cityInfo);
})
.then(function (response) {
  var cityName = response.name;
  var date = moment().format("MMMM Do YYYY");
  var icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
  var temp = `Temperature: ${(response.main.temp - 273.15).toFixed(0)}°C`;
  var humidity = `Humidity: ${response.main.humidity}%`;
  var windSpeed = `Wind speed: ${((response.wind.speed * 3600) / 1000).toFixed(0)} KPH`;

  var iconHeader = $("<img>").attr("src", icon);
  var cityInfoHeader = $("<h1>")
    .text(`${cityName}. ${date}`)
    .append(iconHeader);
  var tempInfo = $("<p>").text(temp);
  var windInfo = $("<p>").text(windSpeed);
  var humidityInfo = $("<p>").text(humidity);

  $("#today").empty();
  $("#today").attr("class", "border mt-3");
  $("#today").append(cityInfoHeader);
  $("#today").append(tempInfo);
  $("#today").append(windInfo);
  $("#today").append(humidityInfo);
});
}

function fiveDayForecast(cityInfo) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityInfo.cityName +
    "&appid=" +
    weatherAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    $("#forecast").empty();
    
    for (i = 0; i < 40; i += 8) {
      var list = response.list[i];
      var date = moment(list.dt_txt).format("MMMM Do YYYY");
      var icon = `https://openweathermap.org/img/wn/${list.weather[0].icon}.png`;
      var temp = `Temperature: ${(list.main.temp - 273.15).toFixed(0)}°C`;
      var humidity = `Humidity: ${list.main.humidity}%`;
      var windSpeed = `Wind speed: ${((list.wind.speed * 3600) / 1000).toFixed(0)} KPH`;
      
      var forecastDiv = $("<div>");
      var iconHeader = $("<img>").attr("src", icon);
      forecastDiv.attr("class", "forecast-div");

      var forecastHeader = $("<h3>").text(date);
      var tempInfo = $("<p>").text(temp);
      var windInfo = $("<p>").text(windSpeed);
      var humidityInfo = $("<p>").text(humidity);

      forecastDiv.append(forecastHeader);
      forecastDiv.append(iconHeader);
      forecastDiv.append(tempInfo);
      forecastDiv.append(windInfo)
      forecastDiv.append(humidityInfo);

      $("#forecast").append(forecastDiv);
    }
  });
}

function cityValidity(cityInfo) {
  if(cityInfo.cityValid === false) {
    cityInfo.cityName = "";
    cityInfo.searchHistory.pop();
    renderButtons(cityInfo);
    alert(`This place does not exist`)
  }
}
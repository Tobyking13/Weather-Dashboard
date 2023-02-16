var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  cityId: "",
  searchHistory: [],
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
  var cityName = $("#search-input").val();
  cityInfo.searchHistory.push(cityName);
  cityInfo.cityName = cityName;
  //getId(cityInfo);
  localStorage.setItem(
    "search-history",
    JSON.stringify(cityInfo.searchHistory)
  );
  renderButtons(cityInfo);
  cityData(cityInfo);
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
  cityData(cityInfo)
}

function cityData(cityInfo) {
  var id = "";
  fetch("./starter/city.list.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (i = 0; i < data.length; i++) {
        var cityData = data[i].name;
        if (cityData === cityInfo.cityName) {
          // cityInfo.cityId = data[i].id;
          id = data[i].id;
        }
      }
    })
    .then(function () {
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?id=" +
        id +
        "&appid=" +
        weatherAPIKey;

      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
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
    })
    .then(function () {
      fiveDayForcast(id);
    });
}

function fiveDayForcast(id) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    id +
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
      // windInfo.css('font-size', '100%')
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

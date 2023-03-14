var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  searchHistory: [],
  cityValid: undefined,
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
  var cityName = $("#search-input").val().trim();
  if (cityName === "") {
    cityName = "Greater London";
  }
  let cityNameArr = [];
  cityName = cityName.toLowerCase().split(" ");
  for (let i = 0; i < cityName.length; i++) {
    cityNameArr.push(
      cityName[i].charAt(0).toUpperCase() + cityName[i].slice(1)
    );
  }

  cityName = cityNameArr.join(" ");
  cityInfo.cityName = cityName;

  for (let i = 0; i < cityInfo.searchHistory.length; i++) {
    if (cityName === cityInfo.searchHistory[i]) {
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
    let button = $("<button>");
    button.text(cityInfo.searchHistory[i]);

    button.attr("data-name", cityInfo.searchHistory[i]);
    button.addClass("btn btn-outline-dark");

    $("#history").append(button);

    button.click(function (e) {
      let buttonDataName = e.target.dataset.name;
      cityInfo.cityName = buttonDataName;
      renderButtons(cityInfo);
      localStorage.setItem(
        "search-history",
        JSON.stringify(cityInfo.searchHistory)
      );
    });
  }
  if (cityInfo.cityName === "") {
    return;
  }
  currentForecast(cityInfo);
  fiveDayForecast(cityInfo);
}

function currentForecast(cityInfo) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityInfo.cityName +
    "&appid=" +
    weatherAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .done(function () {
      cityInfo.cityValid = true;
    })
    .fail(function () {
      cityInfo.cityValid = false;
      cityValidity(cityInfo);
    })
    .then(function (response) {
      const cityName = response.name;
      const date = moment().format("MMMM Do YYYY");
      const icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
      const temp = `Temperature: ${(response.main.temp - 273.15).toFixed(0)}°C`;
      const humidity = `Humidity: ${response.main.humidity}%`;
      const windSpeed = `Wind speed: ${(
        (response.wind.speed * 3600) /
        1000
      ).toFixed(0)} KPH`;

      const iconHeader = $("<img>").attr("src", icon);
      const cityInfoHeader = $("<h1>")
        .text(`${cityName}. ${date}`)
        .append(iconHeader);
      const tempInfo = $("<p>").text(temp);
      const windInfo = $("<p>").text(windSpeed);
      const humidityInfo = $("<p>").text(humidity);

      $("#today").empty();
      $("#today").attr("class", "border mt-3");
      $("#today").append(cityInfoHeader);
      $("#today").append(tempInfo);
      $("#today").append(windInfo);
      $("#today").append(humidityInfo);
    });
}

function fiveDayForecast(cityInfo) {
  const queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityInfo.cityName +
    "&appid=" +
    weatherAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    $("#forecast").empty();

    for (i = 7; i < 40; i += 8) {
      console.log(response)
      const list = response.list[i];
      const date = moment(list.dt_txt).format("MMMM Do YYYY");
      const icon = `https://openweathermap.org/img/wn/${list.weather[0].icon}.png`;
      const temp = `Temperature: ${(list.main.temp - 273.15).toFixed(0)}°C`;
      const humidity = `Humidity: ${list.main.humidity}%`;
      const windSpeed = `Wind speed: ${(
        (list.wind.speed * 3600) /
        1000
      ).toFixed(0)} KPH`;
      const forecastDiv = $("<div>");
      const iconHeader = $("<img>").attr("src", icon);
      forecastDiv.attr("class", "forecast-div");
      const forecastHeader = $("<h3>").text(date);
      const tempInfo = $("<p>").text(temp);
      const windInfo = $("<p>").text(windSpeed);
      const humidityInfo = $("<p>").text(humidity);
      forecastDiv.append(forecastHeader);
      forecastDiv.append(iconHeader);
      forecastDiv.append(tempInfo);
      forecastDiv.append(windInfo);
      forecastDiv.append(humidityInfo);

      $("#forecast").append(forecastDiv);
    }
  });
}

function cityValidity(cityInfo) {
  if (cityInfo.cityValid === false) {
    cityInfo.cityName = "";
    cityInfo.searchHistory.pop();
    renderButtons(cityInfo);
    $("#today").empty();
    $("#forecast").empty();
    var warningMessage = $("<h1>").text(
      `This place does not exist, please search again.`
    );
    $("#today").attr("class", "border mt-3");
    $("#today").append(warningMessage);
  }
}

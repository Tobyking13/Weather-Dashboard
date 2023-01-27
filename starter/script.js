var weatehrAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  cityId: "",
};

// create function to use search box to get id from city.list.json

// get value from search-input
// use if state to compare .name to value
$("#search-button").click(function (e) {
  e.preventDefault();
  getCityId();
});

function getCityId() {
  fetch("./starter/city.list.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var citySearch = $("#search-input").val().toLowerCase();
      for (i = 0; i < data.length; i++) {
        var cityList = data[i].name.toLowerCase();
        if (citySearch === cityList) {
          cityInfo.cityName = citySearch;
          cityInfo.cityId = data[i].id.toString();
        }
      }
      cityData(cityInfo);
    });
}

function cityData(cityInfo) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?id=" +
    cityInfo.cityId +
    "&appid=" +
    weatehrAPIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);
    })
}

var weatherAPIKey = "a38638b883e12f2d3fec49b471358ae8";
var cityInfo = {
  cityName: "",
  cityId: "",
  searchHistory: []
};

// create function to use search box to get id from city.list.json

// get value from search-input
// use if state to compare .name to value
$("#search-button").click(function (e) {
  e.preventDefault();
  getCityId();
});

function getCityId(name) {
  fetch("./starter/city.list.json")
    .then(function(response) {
      return response.json();
    })
    .then(function (data) {
      var citySearch = $("#search-input").val().toLowerCase();
      for (i = 0; i < data.length; i++) {
        var cityList = data[i].name.toLowerCase();
        if (citySearch === cityList || name === cityList) {
          cityInfo.cityName = data[i].name;
          cityInfo.cityId = data[i].id;
        } 
      }
      cityInfo.searchHistory.push(cityInfo.cityName);
      cityData(cityInfo);
      fiveDayForcast(cityInfo);
      buttonHistory(cityInfo)
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
  })
    .then(function(response) {
      var cityName = response.name
      var date = moment().format('MMMM Do YYYY');
      var icon = response.weather[0].icon;
      var temp = (response.main.temp - 273.15).toFixed(2) + "°C";
      var humidity = response.main.humidity + "%";
      var windSpeed = (response.wind.speed * 3600) / 1000 + " KPH"
      console.log(cityName, date, icon, temp, humidity, windSpeed)
    })
}


// Search needs to to create a button with the city name that the user can then select to gather data on that city.

// search info needs to store; CITY NAME, DATE, ICON OF WEATHER CONDITIONS, TEMP IN C, HUMIDITY, WIND SPEED
//

// get 5 day forcast info
// display needs to show DATE, ICON OF WEATHER CONDITIONS, TEMP, HUMIDITY

function fiveDayForcast(cityInfo) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityInfo.cityId + "&appid=" + weatherAPIKey;

    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then(function(response) {
        
        for (i = 0; i < 121; i += 8) {
            var list = response.list
            // figure out 5 day date
            var icon = list[i].weather[0].icon;
            var temp = (list[i].main.temp - 273.15).toFixed(2) + "°C";
            var humidity = list[i].main.humidity + "%";

            console.log(icon, temp, humidity)
        }
    })
}

function buttonHistory(cityInfo) {
    console.log(cityInfo)
    var button = $('<button>');
    for(i = 0; i < cityInfo.searchHistory.length; i++) {
        button.text(cityInfo.searchHistory[i]);
        button.attr('dataset', cityInfo.cityName)
        console.log(button[0].innerText)
        if (button.innerText !== cityInfo.searchHistory[i]) {
            $('#history').append(button)

        }


    
    }

    button.click(function(e) {
        console.log(button.attr('dataset'))

        if(button.attr('dataset') === cityInfo.cityName) {
            getCityId(cityInfo.cityName)
        }
    })

}





// function fiveDayDate() {
//     var month = moment().format('MM');
//     var year = moment().format('YYYY')

//     for(i = 1; i <= 5; i++) {
//         var day = moment().format('D')
//         day = +day
//         day += i
//         return (`${month}/${day}/${year}`)
//     };
// }

// console.log(fiveDayDate())
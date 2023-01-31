# Toby King - Weather Dashboard

## Description

I have created a weather dashboard using Javascript, jQuery, moment.js & Bootstrap. I went about getting info on searched places unusually. I opted to use the city JSON data provided on the OpenWeatherMap website as a reference. I created a function called getId that would compare a user search/search history against the massive list of places on the separate JSON file and retrieve the unique ID of the desired location. To get my function to work I used fetch API.

Then the application stores the searched location in local storage and creates a button that can recall the weather information for that city. Using the unique ID the application can then retrieve information for current weather conditions & the 5-day forecast. I picked certain bits of the JSON data I wanted to use and used jQuery to make them viewable in a tidy format on the DOM. I had some difficulty with getting this to work smoothly and it as a project is a long way from being complete but the basic functionality is there and I am happy with how the app is currently working. 

I used moment.js to convert unix data into dates which allowed me to show the dates easily for the 5-day forecast. The icons also took a bit of researching before I figured out how to make them viewable and not just a code representation such as: "01d". I learned that the code was part of a URL to that individual .png and so was able to create image tags and set an src attribute linking the tag to the URL of that icon.

I didn't need to search for the city by ID, it was more of a learning experience to see how I can use separate JSON data to integrate with my application. In future, I may remove that part or update the code as this app now requires updating the JSON to have an up-to-date list of places to search.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Issues](#issues)

## Installation

https://tobyking13.github.io/Weather-Dashboard/

## Usage

![Toby King Weather Dashboard](./images/Screenshot-Weather-Dashboard.png "Toby King Weather Dashboard" )
Screenshot of the webpage live on Github pages.

## Features

* User can search for a town or a city anywhere in the world and the weather dashboard will display current weather infomation & a 5 day forecast.
* Infomation shown includes; temperature, humidity, windspeed & an icon showing the current weather conditions.
* The application will store user search history to local storage allowing easy access to previously searched results.  

## Issues

* The application requires a double click in order to view weather information. This is irritating as it give the application a feeling that it is slow and unresponsive.
* This also means that the search button does not work as indended. If you double click, it will save the city searched twice to local storage before showing the weather data for that city. 
const dayNameElement = document.querySelector(".day-name");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const locationElement = document.querySelector(".location");
const descriptionElement = document.querySelector(".temperature-description");
const notificationElement = document.querySelector(".notification");
const key = "2aabda1f2c2d6bc4961f00354a863558";
const weather = {};
    weather.temperature = {
        unit:"celsius", 
        temperature:""
    }
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser ondersteunt geen locatie weergave.</p>";
    }
}
getLocation();
let latitude = 0;
let longitude = 0;
function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}&lang=nl`;
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp);
			weather.iconId = data.weather[0].icon;
            weather.description = data.weather[0].description;
            weather.location = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        });
}
function displayWeather() {
    dayNameElement.innerHTML = "Vandaag";
    iconElement.innerHTML = `<img src="img/icon/${weather.iconId}.gif"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descriptionElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.location}, ${weather.country}`;
    document.body.style.backgroundImage = `url('img/bg/${weather.iconId}.gif')`;
}
tempElement.addEventListener("click", function(){
    console.log("click");
});
const prev = document.querySelector("#buttonleft");
const next = document.querySelector("#buttonright");
let activeDay = 0;
checkButtons();
prev.addEventListener("click", function(e){
    if(activeDay > 0){
        prev.classList.remove("inactive");
        next.classList.remove("inactive");
        
        activeDay--;
        changeForecastDay();
    }else{
        console.log("Minimum bereikt");
        prev.classList.add("inactive");
    }  
    checkButtons();
});
next.addEventListener("click", function(e){
    if(activeDay < 5){
        prev.classList.remove("inactive");
        next.classList.remove("inactive");
        
        activeDay++;
        changeForecastDay();
    }else{
        console.log("Maximum bereikt");
        next.classList.add("inactive");
    }
    checkButtons();
});
function checkButtons(){
    if(activeDay === 0) {
        prev.classList.add("inactive");
    } else {
        prev.classList.remove("inactive");
    }
    if(activeDay === 5) {
        next.classList.add("inactive");
    } else {
        next.classList.remove("inactive");
    }
}
function changeForecastDay(){
    if(activeDay == 0) {
        console.log("Vandaag");
        getWeather(latitude, longitude);
    } else {
        if(weatherReport.days.length === 0){
            console.log("Voorspellingen ophalen...");
            getForecast(latitude, longitude);
        } else {
            displayDayForecast();
        }
    }
}
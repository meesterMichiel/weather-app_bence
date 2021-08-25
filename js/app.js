// --------- HUIDIGE WEER ---------

// html elementen selecteren
const dayNameElement = document.querySelector(".day-name");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const locationElement = document.querySelector(".location");
const descriptionElement = document.querySelector(".temperature-description");
const notificationElement = document.querySelector(".notification");


// API key van openweathermap opslaan in variabele 
// (documentatie https://openweathermap.org/ )
const key = "2aabda1f2c2d6bc4961f00354a863558";

// leeg object waarin API kan worden opgeslaan 
const weather = {};
    // property temperature toevoegen aan weather object
    weather.temperature = {
        unit:"celsius", 
        temperature:""
    }

function getLocation() {
    // controleren of browser geolocatie ondersteunt
    if (navigator.geolocation) {
    // wanneer de methode succesvol is aangeroepen de functie setPosition aanroepen anders de functie showError aanroepen
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser ondersteunt geen locatie weergave.</p>";
    }
}
getLocation();

// positie van de bezoeker bepalen
let latitude = 0;
let longitude = 0;

function setPosition(position) {
    // opgevraagde breedtegraad en lengtegraad in de bijhorende variabele stoppen   
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    //API openweathermap aanroepen met functie getWeather() en coördinaten als parameters
    getWeather(latitude, longitude);
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
function getWeather(latitude, longitude) {
    // api aanroepen
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}&lang=nl`;
    // methode fetch() -> ophalen data
    fetch(api)
        .then(function (response) {
            let data = response.json();
            return data;
        })
        // then() methode start wanneer belofte json() methode is nagekomen
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp);
			weather.iconId = data.weather[0].icon;
            weather.description = data.weather[0].description;
            weather.location = data.name;
            weather.country = data.sys.country;
        })
        // als alles goed verloopt wordt het weer getoond
        .then(function () {
            displayWeather();
        });
}

function displayWeather() {
    // -------------------------------------------
    dayNameElement.innerHTML = "Vandaag";
    iconElement.innerHTML = `<img src="img/icon/${weather.iconId}.gif"/>`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descriptionElement.innerHTML = `${weather.description}`;
    locationElement.innerHTML = `${weather.location}, ${weather.country}`;
    // achtergrond verandert afhankelijk van het weer
    document.body.style.backgroundImage = `url('img/bg/${weather.iconId}.gif')`;
}

tempElement.addEventListener("click", function(){
    console.log("click");
});

const prev = document.querySelector("#buttonleft");
const next = document.querySelector("#buttonright");

// bij openen van de app is active dag => 0 => huidige dag
let activeDay = 0;
checkButtons();

// eventlisteners knoppen
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
        // huidig weer kan veranderen dus wordt elke keer opnieuw opgevraagd
        getWeather(latitude, longitude);
    } else {
        if(weatherReport.days.length === 0){
            // voorspellingen werden nog niet opgehaald => eerst ophalen
            console.log("Voorspellingen ophalen...");
            getForecast(latitude, longitude);
        } else {
            displayDayForecast();
        }
    }
}
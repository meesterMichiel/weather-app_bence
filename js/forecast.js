// --------- 5DAAGSE VOORSPELLING ---------

// html elementen selecteren
const dailyElement = document.querySelector(".daily-forecast");


// API key van openweathermap opslaan in variabele 
// (documentatie https://openweathermap.org/ )
const lang = "nl";
const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

// leeg object waarin API kan worden opgeslaan
const weatherReport = {};
    // property temperature toevoegen aan weather object
    weatherReport.temperature = {
        unit: "celsius"
    }
    // lege array voor dagelijks weerrapport in op te slaan
weatherReport.days = [];

// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
function getForecast(latitude, longitude) {
    // api aanroepen
       let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=${lang}&units=metric&appid=${key}`;
    // methode fetch() -> ophalen data
    fetch(api)
        .then(function (response) {
            const data = response.json();
            return data;
        })
        .then(function (data) {       
            const dailyForecast = data.list;
            // om door de array van dagen te lopen:
            dailyForecast.forEach(function(e,index) {
                // het argument e zijn de gegevens van 1 dag
                const fullDate = new Date(e.dt_txt);
                const hourByDate = fullDate.getHours();

                if(hourByDate > 5 && hourByDate < 9){ 
                    // de methode getDay() geeft de dag van de week terug => zondag = 0, maandag = 1, ...
                    // aan de hand van de array days, bovenaan aangemaakt, wordt de weekdag in het nederlands bepaald
                    // days[0] selecteert het eerste item uit de array => "zondag"
                    const dayName = days[fullDate.getDay()];
                
                    // object day zal de weergegevens van 1 dag die zullen gebruikt worden in de app verzamelen
                    const day = {
                        temperature: Math.floor(Math.floor(e.main.temp)),
                        description: e.weather[0].description,
                        iconId: e.weather[0].icon,
                        fullDate: fullDate,
                        dayName: dayName
                    };

                    // met de methode push voegen we het object day toe aan de array days die onderdeel is van het object weatherReport
                    weatherReport.days.push(day);
                }
            });
        })
        .then(function () {   
            displayDayForecast();
        });
}

function displayDayForecast() {
    let i = activeDay - 1;
    // -------------------------------------------
    dayNameElement.innerHTML = `${weatherReport.days[i].dayName}`;
    iconElement.innerHTML = `<img src="img/icon/${weatherReport.days[i].iconId}.gif"/>`;
    tempElement.innerHTML = `${weatherReport.days[i].temperature}°<span>C</span>`;
    descriptionElement.innerHTML = `${weatherReport.days[i].description}`;
    //locationElement.innerHTML = `${weather.location}, ${weather.country}`;
    document.body.style.backgroundImage = `url('img/bg/${weatherReport.days[i].iconId}.gif')`;
}
const dailyElement = document.querySelector(".daily-forecast");
const lang = "nl";
const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
const weatherReport = {};
    weatherReport.temperature = {
        unit: "celsius"
    }
weatherReport.days = [];
function getForecast(latitude, longitude) {
       let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=${lang}&units=metric&appid=${key}`;
        fetch(api)
        .then(function (response) {
            const data = response.json();
            return data;
        })
        .then(function (data) {       
            const dailyForecast = data.list;
            dailyForecast.forEach(function(e,index) {
                const fullDate = new Date(e.dt_txt);
                const hourByDate = fullDate.getHours();
                if(hourByDate > 5 && hourByDate < 9){ 
                    const dayName = days[fullDate.getDay()];
                    const day = {
                        temperature: Math.floor(Math.floor(e.main.temp)),
                        description: e.weather[0].description,
                        iconId: e.weather[0].icon,
                        fullDate: fullDate,
                        dayName: dayName
                    };
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
    dayNameElement.innerHTML = `${weatherReport.days[i].dayName}`;
    iconElement.innerHTML = `<img src="img/icon/${weatherReport.days[i].iconId}.gif"/>`;
    tempElement.innerHTML = `${weatherReport.days[i].temperature}°<span>C</span>`;
    descriptionElement.innerHTML = `${weatherReport.days[i].description}`;
    document.body.style.backgroundImage = `url('img/bg/${weatherReport.days[i].iconId}.gif')`;
}
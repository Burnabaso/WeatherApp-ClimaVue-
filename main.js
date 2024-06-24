// Store city input by user
var apiKey = "6dad0cf0600187d4acab4b62e7bc9023";
var city;
const windSpeedContainer = document.getElementById("wind-speed");
const windDirectContainer = document.getElementById("wind-direction");
const humidityContainer = document.getElementById("humidity");
const feelLikeContainer = document.getElementById("feel-temp");
const lonContainer = document.getElementById("lon");
const latContainer = document.getElementById("lat");
const pressureContainer = document.getElementById("pressure");
const maxTempContainer = document.getElementById("max-temp");
const minTempContainer = document.getElementById("min-temp");
const sunriseTimeContainer = document.getElementById("sunrise-time");
const cloudsContainer = document.getElementById("clouds-%");
const tempValueContainer = document.getElementById("temp-value");
const conditionContainer = document.getElementById("condition");
const sunsetContainer = document.getElementById("sunset");
const iconContainer = document.getElementById("weather-icon");
const dayOfWeekContainer = document.getElementById("day-of-week");
const timeContainer = document.getElementById("time");
const dayInMonthContainer = document.getElementById("day-in-month");
const locationContainer = document.getElementById("location-name");
const dateContainer = document.getElementById("date");

async function getCityCoordinates(city, apiKey) {
  let geoCodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  let georesponse = await fetch(geoCodeUrl);
  let geodata = await georesponse.json();
  if (geodata.length > 0) {
    return {
      lat: geodata[0].lat,
      lon: geodata[0].lon,
      country: geodata[0].country,
      cityName: geodata[0].name,
    };
  } else {
    alert("Incorrect Name of City, Please Try Again");
    throw new Error("City Not Found");
  }
}
async function getWeatherData(lat, lon, apiKey) {
  let oneCallUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  let oneCallResponse = await fetch(oneCallUrl);
  let oneCallData = await oneCallResponse.json();
  //Extracting Data from the API JSON response
  let weatherDescription = oneCallData.weather[0].description;
  let weatherTemperature = oneCallData.main.temp;
  let tempRound = Math.round(weatherTemperature);
  let windSpeed = oneCallData.wind.speed;
  //Converted windSpeed from m/s to km/hr
  let windSpeedConverted = Math.round(3.6 * windSpeed);
  //converted the wind degree to direction (N,S,NE,...)
  let windDegree = oneCallData.wind.deg;
  let windDirection = convertDegToDirection(windDegree);
  let humidity = oneCallData.main.humidity;
  let reelFeel = oneCallData.main.feels_like;
  // sunset time is in unix unit so we convert it to 24h format
  let Sunset = oneCallData.sys.sunset;
  let sunsetTime = new Date(Sunset * 1000);
  let timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  let SunsetTimeString = sunsetTime.toLocaleTimeString("en-US", timeOptions);
  // sunrise time is in unix unit so we convert it to 24hr Format
  let sunRise = oneCallData.sys.sunrise;
  let sunriseTime = new Date(sunRise * 1000);
  let SunriseTimeString = sunriseTime.toLocaleTimeString("en-US", timeOptions);
  //fetching weather condition icon code to add to the url to fetch the image 
  let iconCode = oneCallData.weather[0].icon;
  let longitude = oneCallData.coord.lon;
  let latitude = oneCallData.coord.lat;
  let pressure = oneCallData.main.pressure;
  let rainVolume = oneCallData.rain;
  let minTemp = oneCallData.main.temp_min;
  let maxTemp = oneCallData.main.temp_max;
  let cloud = oneCallData.clouds.all;
  return {
    description: weatherDescription,
    temp: tempRound,
    sunset: SunsetTimeString,
    sunrise:SunriseTimeString,
    icon: iconCode,
    windS: windSpeedConverted,
    windDirect: windDirection,
    humid: humidity,
    feels_like: reelFeel,
    long:longitude,
    lati:latitude,
    press:pressure,
    rainVol:rainVolume,
    max:maxTemp,
    min:minTemp,
    cloudPercent:cloud
  };
}
function convertDegToDirection(windDegree) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
    "N",
  ];
  degreeIndex = 1+Math.round((windDegree%360)/22.5);
  return directions[degreeIndex];
}
function convertMonth(month_number) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month_number - 1];
}
function convertDay(day_number) {
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return dayNames[day_number - 1];
}
function getDate() {
  let month = new Date().getMonth() + 1;
  let monthName = convertMonth(month);
  let year = new Date().getFullYear();
  return `${monthName} ${year}`;
}
async function getTime(lat, lon) {
  let timeUrl = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;
  let timeResponse = await fetch(timeUrl);
  let timeData = await timeResponse.json();
  console.log("Time data: ", timeData);
  let day = timeData.dayOfWeek;
  let time = timeData.time;
  return {
    Day: day,
    Time: time,
    DayNumber: timeData.day,
  };
}
document.getElementById("city-search").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      city = event.target.value;

      getCityCoordinates(city, apiKey).then((coord) => getWeatherData(coord.lat, coord.lon, apiKey)).then((weatherData) => {
          tempValueContainer.innerText = `${weatherData.temp}`;
          conditionContainer.innerText = `${weatherData.description}`;
          sunsetContainer.innerText = `${weatherData.sunset}`;
          iconContainer.setAttribute("src",`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`);
          windSpeedContainer.innerText=`${weatherData.windS}`;
          windDirectContainer.innerText=`${weatherData.windDirect}`;
          humidityContainer.innerText=`${weatherData.humid}`;
          feelLikeContainer.innerText=`${weatherData.feels_like}`;
          lonContainer.innerText=`${weatherData.long}`;
          latContainer.innerText=`${weatherData.lati}`;
          pressureContainer.innerText=`${weatherData.press}`;
          maxTempContainer.innerText=`${weatherData.max}`;
          minTempContainer.innerText=`${weatherData.min}`;
          sunriseTimeContainer.innerText=`${weatherData.sunrise}`;
          cloudsContainer.innerText=`${weatherData.cloudPercent}`;
        });

      getCityCoordinates(city, apiKey).then((coordinates) => getTime(coordinates.lat, coordinates.lon)).then((timedata) => {
          dayOfWeekContainer.innerText = `${timedata.Day}`;
          timeContainer.innerText = `${timedata.Time}`;
          dayInMonthContainer.innerText = `${timedata.DayNumber}`;
      });
      getCityCoordinates(city, apiKey).then((coordinates) => {
          locationContainer.innerText = `${coordinates.cityName}, ${coordinates.country}`;
      });

      let Date = getDate();
      dateContainer.innerText = Date;
    }
  });

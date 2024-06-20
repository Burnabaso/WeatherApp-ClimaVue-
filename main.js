// Store city input by user
const apiKey = "6dad0cf0600187d4acab4b62e7bc9023";
var city;
async function getCityCoordinates(city, apiKey) {
  let geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  let georesponse = await fetch(geoCodeUrl);
  let geodata = await georesponse.json();
  console.log(geodata);
  if (geodata.length > 0) {
    return {
      lat: geodata[0].lat,
      lon: geodata[0].lon,
      country: geodata[0].country,
      cityName: geodata[0].name
    };
  } else {
    throw new Error("City Not Found");
  }
}
async function getWeatherData(lat, lon, apiKey) {
  let oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${apiKey}`;
  let oneCallResponse = await fetch(oneCallUrl);
  let oneCallData = await oneCallResponse.json();
  if (oneCallData.length > 0) {
    return oneCallResponse.json();
  } else {
    throw new Error("Weather Data wasn't fetched");
  }
}
function extractWeatherData(weatherData) {
  let currentWeather = weatherData.current;
  let temp = currentWeather.temp;
  let weatherCondition = currentWeather.weather[0].description;
  return {
    temperature: temp,
    description: weatherCondition,
  };
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
  return monthNames[month_number-1];
}
function convertDay(day_number)
{
    const dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    return dayNames[day_number-1]
}
function getDate()
{
    let month = new Date().getMonth()+1;
    let monthName= convertMonth(month);
    let day = new Date().getDay();
    let dayName = convertDay(day);
    let year = new Date().getFullYear();
    return `${monthName} ${year}`;
}
async function getTime(lat, lon) {
  let timeUrl = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;
  let timeResponse = await fetch(timeUrl);
  let timeData = await timeResponse.json();
  console.log(timeData);
  let day = timeData.dayOfWeek;
  let time = timeData.time;
  return{
    Day: day,
    Time:time,
    DayNumber:timeData.day
  }

}
document
  .getElementById("city-search")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      city = event.target.value;
    }
    getCityCoordinates(city, apiKey)
      .then((coord) => getWeatherData(coord.lat, coord.lon, apiKey))
      .then((weathData) => {
        const extractedData = extractWeatherData(weathData);
        document.getElementById(
          "temp-value"
        ).innerText = `${extractedData.temperature}`;
        document.getElementById(
          "condition"
        ).innerText = `${extractedData.description}`;
      });

    getCityCoordinates(city, apiKey).then((cordinates) =>
      getTime(cordinates.lat, cordinates.lon)
    )
    .then((timedata)=>{
        document.getElementById("day-of-week").innerText=`${timedata.Day}`;
        document.getElementById("time").innerText=`${timedata.Time}`;
        document.getElementById("day-in-month").innerText=`${timedata.DayNumber}`;
    });
    getCityCoordinates(city,apiKey).then((coordinates)=>{
        document.getElementById("location-name").innerText=`${coordinates.cityName}, ${coordinates.country}`;
    });
    let Date = getDate();
    document.getElementById("date").innerText= Date;
  });

// Store city input by user
var apiKey = "6dad0cf0600187d4acab4b62e7bc9023";
var city;
async function getCityCoordinates(city, apiKey) {
  let geoCodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
  let georesponse = await fetch(geoCodeUrl);
  let geodata = await georesponse.json();
  console.log("City Coordinates: ",geodata);
  if (geodata.length > 0) {
    return {
      lat: geodata[0].lat,
      lon: geodata[0].lon,
      country: geodata[0].country,
      cityName: geodata[0].name
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
  console.log("Current Weather: ",oneCallData);
  let weatherDescription = oneCallData.weather[0].description;
  let weatherTemperature = oneCallData.main.temp;
  let tempRound = Math.round(weatherTemperature);
  console.log(typeof weatherTemperature);
  let Sunset = oneCallData.sys.sunset;
  let sunsetTime = new Date(Sunset*1000);
  let timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false};
  let timeString = sunsetTime.toLocaleTimeString('en-US', timeOptions); 
  let iconCode = oneCallData.weather[0].icon;
  return {
    description: weatherDescription,
    temp: tempRound,
    sunset: timeString,
    icon:iconCode
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
    let year = new Date().getFullYear();
    return `${monthName} ${year}`;
}
async function getTime(lat, lon) {
  let timeUrl = `https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`;
  let timeResponse = await fetch(timeUrl);
  let timeData = await timeResponse.json();
  console.log("Time data: ",timeData);
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

      getCityCoordinates(city, apiKey)
      .then((coord) => getWeatherData(coord.lat, coord.lon, apiKey))
      .then((weatherData)=>
        {
            document.getElementById("temp-value").innerText=`${weatherData.temp}`;
            document.getElementById("condition").innerText=`${weatherData.description}`;
            document.getElementById("day-night").innerText=`${weatherData.sunset}`;
            document.getElementById("weather-icon").setAttribute("src",`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`);
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
    }
    
  });

$(document).ready(() => {
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    const city = localStorage.key(i);
    const forecast = JSON.parse(localStorage.getItem(city));

    renderButton(city, forecast);
  }
});

$("#search-button").click(async (e) => {
  e.preventDefault();
  const searchInputValue = $("#search-input").val();
  const cityName = capitalizeFirstLetter(searchInputValue);

  const response = await OpenWeatherApi.getCoordinates(cityName);
  if (!response) {
    alert("I cannot recognize this city, sorry...");
    return;
  }
  const { lat, lon } = response;

  const { list: weatherList } = await OpenWeatherApi.getForecast(lat, lon);

  const transformedWeathers = transforOpenWeatherResponse(weatherList);
  saveToLocalStorageAndRenderButton(cityName, transformedWeathers);
  renderForecast(cityName, transformedWeathers);
});

function saveToLocalStorageAndRenderButton(city, forecast) {
  localStorage.setItem(city, JSON.stringify(forecast));

  renderButton(city, forecast);
}

function renderButton(city, forecast) {
  const button = $("<button>")
    .addClass("btn btn-secondary")
    .text(city)
    .click(() => renderForecast(city, forecast));
  $("#history").append(button);
}

function renderForecast(city, forecast) {
  renderCurrentDay(city, forecast[0]);
  render4DayForecast(forecast.slice(1));
}

function renderCurrentDay(city, forecastForToday) {
  const cityLine = $("<h2>").text(`${city} (${forecastForToday.date})`);
  const tempLine = $("<p>").text(`Temp: ${forecastForToday.temp}°C`);
  const windLine = $("<p>").text(`Wind: ${forecastForToday.wind} KPH`);
  const humLine = $("<p>").text(`Humidity: ${forecastForToday.humidity}%`);

  const todaySection = $("#today");
  todaySection.html(cityLine);
  todaySection.append(tempLine, windLine, humLine);
}

function render4DayForecast(forecastFor4Days) {
  const headerForecast = $("<h3>").text("5-Day Forecast:");
  const container = $("<div>").addClass("d-flex");

  const forecast = $("#forecast");
  forecast.html(headerForecast);
  forecast.append(container);

  for (let i = 0; i < forecastFor4Days.length; i++) {
    const singleDayForecast = forecastFor4Days[i];
    container.append(createSingleDay(singleDayForecast));
  }
}

function createSingleDay(singleDayForecast) {
  const pTemp = $("<p>").text(`Temp: ${singleDayForecast.temp}°C`);
  const pWind = $("<p>").text(`Wind: ${singleDayForecast.wind} KPH`);
  const pHum = $("<p>").text(`Humidity: ${singleDayForecast.humidity}%`);
  const cardTitle = $("<h5>")
    .addClass("card-title")
    .text(singleDayForecast.date);
  const cardText = $("<div>").addClass("card-text").append(pTemp, pWind, pHum);
  const cardBody = $("<div>").addClass("card-body").append(cardTitle, cardText);
  const card = $("<div>").addClass("card weather-card").append(cardBody);

  return card;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function transforOpenWeatherResponse(weatherList) {
  const transformedWeathers = [];
  const today = new Date().getDate();

  for (let i = 0; i < weatherList.length; i++) {
    const weatherItem = weatherList[i];
    if (i === 0) {
      const newTempWeather = {
        date: moment().format("D/M/YYYY"),
        iconUrl: `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`,
        temp: (weatherItem.main.temp - 273.15).toFixed(2),
        wind: weatherItem.wind.speed.toFixed(2),
        humidity: weatherItem.main.humidity,
      };
      transformedWeathers.push(newTempWeather);
    }

    if (
      moment(weatherItem.dt_txt).format("H") === "15" &&
      moment(weatherItem.dt_txt).format("DD") !== today
    ) {
      const newTempWeather = {
        date: moment(weatherItem.dt_txt).format("D/M/YYYY"),
        iconUrl: `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`,
        temp: (weatherItem.main.temp - 273.15).toFixed(2),
        wind: weatherItem.wind.speed.toFixed(2),
        humidity: weatherItem.main.humidity,
      };
      transformedWeathers.push(newTempWeather);
    }

    if (transformedWeathers.length === 5) break;
  }
  return transformedWeathers;
}

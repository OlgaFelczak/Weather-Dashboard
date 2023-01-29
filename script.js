const OPENWEATHER_API_KEY = "06fb19c27e224182b356f169df69f800";

// Create button to search city
$("#search-button").click(async (e) => {
  e.preventDefault();
  const searchInputValue = $("#search-input").val();

  const { lon, lat } = await OpenWeatherApi.getCoordinates(searchInputValue);
  console.log(lon, lat);

  const { list } = await city.getData(lat, lon);
  console.log(list);
});

const OpenWeatherApi = {
  getCoordinates: async (cityName) => {
    const data = await $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${OPENWEATHER_API_KEY}`,
    });

    return data[0];
  },
};

const city = {
  getData: async (lat, lon) => {
    const list = await $.ajax({
      method: "GET",
      url: `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
    });

    return list;
  },
};

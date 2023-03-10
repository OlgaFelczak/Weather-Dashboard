const OPENWEATHER_API_KEY = "06fb19c27e224182b356f169df69f800";

const OpenWeatherApi = {
  getCoordinates: async (cityName) => {
    const data = await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${OPENWEATHER_API_KEY}`,
    });

    return data[0];
  },

  getForecast: async (lat, lon) => {
    const list = await $.ajax({
      method: "GET",
      url: `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`,
    });

    return list;
  },
};

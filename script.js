// Create button to search city
$("#search-button").click(async (e) => {
  e.preventDefault();
  const searchInputValue = $("#search-input").val();

  const { lon, lat } = await OpenWeatherApi.getCoordinates(searchInputValue);
  console.log(lon, lat);

  const { list } = await OpenWeatherApi.getForecast(lat, lon);
  console.log(list);
});

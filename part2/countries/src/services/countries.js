import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";
const weatherBaseUrl = "https://api.openweathermap.org/data/2.5/weather?q=";

const weatherApiKey = import.meta.env.VITE_WEATHER_API;

const getAll = () => {
  return axios.get(baseUrl + "/all");
};

const getWeather = (cityName, countryCode) => {
  const newString =
    weatherBaseUrl +
    cityName +
    "," +
    countryCode +
    "&units=metric&appid=" +
    weatherApiKey;
  console.log("a call to api is made");
  return axios.get(newString);
};
export default {
  getAll,
  getWeather,
};

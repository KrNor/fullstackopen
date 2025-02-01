import axios from "axios";
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = () => {
  return axios.get(baseUrl + "/all");
};
const getSingle = () => {
  return axios.get(baseUrl + "/name/finland");
};
const getAllSpecified = () => {
  return axios.get(baseUrl + "/all").map((res) => console.log(res)); //res.name.common
};
export default {
  getAll,
  getSingle,
  getAllSpecified,
};

import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const likePost = async (likedBlog) => {
  const config = { headers: { Authorization: token } };
  console.log(likedBlog);
  const updatedBlog = {
    user: likedBlog.user.id,
    likes: likedBlog.likes + 1,
    author: likedBlog.author,
    title: likedBlog.title,
    url: likedBlog.url,
  };
  const response = await axios.put(
    baseUrl + "/" + likedBlog.id,
    updatedBlog,
    config
  );
  return response.data;
};

export default { getAll, create, setToken, likePost };

import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const getById = async (id) => {
  const request = await axios.get(baseUrl + `/${id}`);
  // console.log(request.data);
  return request.data;
};

const create = async (newObject) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const deleteBlog = async (idToDelete) => {
  const config = { headers: { Authorization: token } };
  const response = await axios.delete(baseUrl + "/" + idToDelete, config);
  return response.data;
};
const likeBlog = async (likedBlog) => {
  const config = { headers: { Authorization: token } };
  // console.log(likedBlog);
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

const commentBlog = async (blogObj, gottenComment) => {
  const commentObj = { comment: gottenComment };
  console.log(baseUrl + "/" + blogObj.id + "/comments");
  const response = await axios.post(
    baseUrl + "/" + blogObj.id + "/comments",
    commentObj
  );
  console.log(response);
  return response.data;
};

export default {
  getAll,
  create,
  setToken,
  likeBlog,
  deleteBlog,
  getById,
  commentBlog,
};

const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  //   console.log(blogs);

  var blogCount = blogs
    .map((element) => {
      //   console.log(element.likes);
      return element.likes;
    })
    .reduce((a, b) => a + b, 0);
  //   console.log(asd);
  return blogCount;
};

const favoriteBlog = (blogs) => {
  //   console.log(blogs);
  if (blogs.length < 1) {
    return 0;
  }
  const maxBlog = blogs.reduce((prev, curr) => {
    return prev && prev.likes > curr.likes ? prev : curr;
  });
  //   console.log(maxBlog);
  return {
    title: maxBlog.title,
    author: maxBlog.author,
    likes: maxBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length < 1) {
    return {};
  }
  //   console.log(blogs);
  let blogCount = _.countBy(blogs, _.iteratee("author"));
  let aaaaaa = Object.entries(blogCount);
  let asd = aaaaaa.reduce((prev, curr) => {
    return prev && prev[1] > curr[1] ? prev : curr;
  });
  //   let biggestBlogger = _.maxBy(blogs, function (o) {
  //     return o;
  //   });
  //   console.log(blogCount);
  //   console.log(asd);
  return {
    author: asd[0],
    blogs: asd[1],
  };
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};

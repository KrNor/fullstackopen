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
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  //   console.log(blogs);

  var asd = blogs
    .map((element) => {
      //   console.log(element.likes);
      return element.likes;
    })
    .reduce((a, b) => a + b, 0);
  //   console.log(asd);
  return asd;
};

module.exports = {
  dummy,
  totalLikes,
};

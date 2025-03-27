const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: async () => {
      console.log("bookCount() querry call");
      return await Book.countDocuments({});
    },
    authorCount: async () => {
      return await Author.countDocuments({});
    },
    allAuthors: async () => {
      console.log("Author.find() call");
      return await Author.find({});
    },
    allBooks: async (root, args) => {
      let authorInArgs = false;
      let genreInArgs = false;
      if (args.author) {
        authorInArgs = true;
      }
      if (args.genre) {
        genreInArgs = true;
      }

      try {
        if (authorInArgs && genreInArgs) {
          const authorr = await Author.findOne({
            name: `${args.author}`,
          });

          return await Book.find({ author: authorr._id, genres: args.genre });
        } else if (authorInArgs) {
          const authorr = await Author.findOne({
            name: `${args.author}`,
          });

          return await Book.find({ author: authorr._id });
        } else if (genreInArgs) {
          return await Book.find({ genres: args.genre });
        }
        return await Book.find({});
      } catch (error) {
        throw new GraphQLError(
          "There was an error trying to get books from the server, please give correct information",
          {
            extensions: {
              code: "ERROR_GETTING_BOOKS",
            },
          }
        );
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
    allGenres: async () => {
      return await Book.find().distinct("genres");
    },
  },
  Author: {
    bookCount: async (root, args) => {
      // now it just takes the length of the list of books saved in the author object
      console.log("bookCount() inAuthor call");
      // console.log(root);
      return root.writtenBooks.length;

      // this was the old call to the server
      // const foundAuth = await Author.findById(root._id);
      // if (!foundAuth) {
      //   throw new GraphQLError("searching the author failed", {
      //     extensions: {
      //       code: "AUTHOR_SEARCH_FAILED",
      //       invalidArgs: args.name,
      //     },
      //   });
      // }

      // return await Book.countDocuments({ author: foundAuth._id });
    },
    name: async (root, args) => {
      const foundAuth = await Author.findById(root._id);
      return foundAuth.name;
    },
    born: async (root, args) => {
      const foundAuth = await Author.findById(root._id);
      return foundAuth.born;
    },
    id: async (root, args) => {
      return root._id;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let existingAuthor = null;
      try {
        existingAuthor = await Author.findOne({
          name: `${args.author}`,
        });

        if (existingAuthor === null) {
          existingAuthor = await Author.create({
            name: `${args.author}`,
            writtenBooks: [],
          });
        }
        await existingAuthor.save();
      } catch (error) {
        throw new GraphQLError("checking/making the author failed", {
          extensions: {
            code: "AUTHOR_CHECK_FAILED",
            invalidArgs: args.name,
            error,
          },
        });
      }
      const newBookk = {
        title: args.title,
        published: args.published,
        author: existingAuthor._id,
        genres: args.genres,
      };
      let newlyCreatedBook = null;
      // console.log("this is the author that the book will be added to:");
      // console.log(existingAuthor);
      try {
        newlyCreatedBook = await Book.create(newBookk);
      } catch (error) {
        throw new GraphQLError("Book creation failed", {
          extensions: {
            code: "BOOK_CREATION_FAILED",
            invalidArgs: newBookk,
            error,
          },
        });
      }

      try {
        existingAuthor.writtenBooks.push(newlyCreatedBook._id);

        // console.log(existingAuthor);
        await existingAuthor.save();
      } catch (error) {
        throw new GraphQLError("Book addition to authors list failed", {
          extensions: {
            code: "BOOK_ADDITION_TO_AUTHOR_FAILED",
            invalidArgs: newBookk,
            error,
          },
        });
      }
      // console.log(newlyCreatedBook);
      // console.log(existingAuthor);
      pubsub.publish("BOOK_ADDED", { bookAdded: newlyCreatedBook });

      return newlyCreatedBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const existingAuthor = await Author.findOne({
        name: `${args.name}`,
      });
      if (!existingAuthor) {
        throw new GraphQLError("finding author failed", {
          extensions: {
            code: "AUTHOR_FIND_FAILED",
            invalidArgs: args.name,
          },
        });
      } else {
        existingAuthor.born = args.setBornTo;
      }
      return await existingAuthor.save();
    },
    createUser: async (root, args) => {
      try {
        const user = await User.create({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        });
        return user;
      } catch (error) {
        throw new GraphQLError("User creation failed", {
          extensions: {
            code: "USER_CREATION_FAILED",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("bad login", {
          extensions: {
            code: "USER_LOGIN_FAILED",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };

      const token = jwt.sign(userForToken, process.env.JWT_SECRET);
      return { value: token };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => {
        return pubsub.asyncIterator("BOOK_ADDED");
      },
    },
  },
};

module.exports = resolvers;

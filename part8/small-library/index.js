const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }
  type Book {
    title: String!
    published: Int
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ):Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      return await Book.countDocuments({});
    },
    authorCount: async () => {
      return await Author.countDocuments({});
    },
    allAuthors: async () => await Author.find({}),
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
  },
  Author: {
    bookCount: async (root, args) => {
      const foundAuth = await Author.findOne({ name: root.name });
      if (!foundAuth) {
        throw new GraphQLError("searching the author failed", {
          extensions: {
            code: "AUTHOR_SEARCH_FAILED",
            invalidArgs: args.name,
          },
        });
      }

      return await Book.countDocuments({ author: foundAuth._id });
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
          });
        }
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
        author: existingAuthor,
        genres: args.genres,
      };
      try {
        return await Book.create(newBookk);
      } catch (error) {
        throw new GraphQLError("Book creation failed", {
          extensions: {
            code: "BOOK_CREATION_FAILED",
            invalidArgs: newBookk,
            error,
          },
        });
      }
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
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

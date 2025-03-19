const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
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
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks (author: String, genre: String): [Book!]
    allAuthors: [Author!]!
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
      // at start only all authors will be returned
      // temporary
      return await Book.find({});

      // let authorExists = false;
      // let genreExists = false;
      // if (args.author) {
      //   authorExists = true;
      // }
      // if (args.genre) {
      //   genreExists = true;
      // }

      // if (authorExists && genreExists) {
      //   return books
      //     .filter((boook) => boook.author === args.author)
      //     .filter((boook) => boook.genres.find((gnr) => gnr === args.genre));
      // } else if (authorExists) {
      //   return books.filter((boook) => boook.author === args.author);
      // } else if (genreExists) {
      //   return books.filter((boook) =>
      //     boook.genres.find((gnr) => gnr === args.genre)
      //   );
      // }
      // return books;
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
            error,
          },
        });
      }

      return await Book.countDocuments({ author: foundAuth._id });
    },
  },
  Mutation: {
    addBook: async (root, args) => {
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
    editAuthor: async (root, args) => {
      const existingAuthor = await Author.findOne({
        name: `${args.name}`,
      });
      // console.log(existingAuthor);
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

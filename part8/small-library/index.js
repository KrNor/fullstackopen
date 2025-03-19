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

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

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
    allBooks: (root, args) => {
      let authorExists = false;
      let genreExists = false;
      if (args.author) {
        authorExists = true;
      }
      if (args.genre) {
        genreExists = true;
      }

      if (authorExists && genreExists) {
        return books
          .filter((boook) => boook.author === args.author)
          .filter((boook) => boook.genres.find((gnr) => gnr === args.genre));
      } else if (authorExists) {
        return books.filter((boook) => boook.author === args.author);
      } else if (genreExists) {
        return books.filter((boook) =>
          boook.genres.find((gnr) => gnr === args.genre)
        );
      }
      return books;
    },
  },
  Author: {
    bookCount: (root, args) => {
      return books.filter((book) => book.author === root.name).length;
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
      console.log(newBookk);
      return await Book.create(newBookk);
    },
    editAuthor: (root, args) => {
      const foundAuth = authors.find((auth) => {
        return auth.name === args.name;
      });

      if (foundAuth !== undefined) {
        const updatedAuth = { ...foundAuth, born: args.setBornTo };
        authors = authors.map((aauth) =>
          aauth.name === args.name ? updatedAuth : aauth
        );
        return updatedAuth;
      }
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

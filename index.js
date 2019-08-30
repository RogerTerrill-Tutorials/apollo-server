// Require two main packages to create our server.
const { ApolloServer, gql } = require('apollo-server');

// We will bring in the database from database.js
const { db } = require('./database.js');

// The structure of the following is taken from the docs

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
// Also known as the schema
const typeDefs = gql`
  # We will create the Game type based of our database
  type Game {
    vg_id: Int
    vg_name: String
    vg_cost: Int
    vg_genre: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    games: [Game]
    gameByName(vg_name: String!): Game
  }

  type Mutation {
    addGame(
      vg_name: String!, 
      vg_cost: Int, 
      vg_genre: String
    ): Game
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve games from the "games" array above.
const resolvers = {
  Query: {
    games: () => db.any('SELECT * FROM public.videogames'),
    gameByName: (root, args) =>
      db.one('SELECT * FROM public.videogames WHERE vg_name = ${vg_name}', {
        vg_name: args.vg_name
      })
  },
  Mutation: {
    addGame: (root, args) =>
      db
        .one(
          'INSERT INTO public.videogames(vg_name, vg_cost, vg_genre) VALUES(${vg_name}, ${vg_cost}, ${vg_genre}) RETURNING vg_name, vg_cost, vg_genre',
          {
            vg_name: args.vg_name,
            vg_cost: args.vg_cost,
            vg_genre: args.vg_genre
          }
        )
        .then(data => {
          console.log(`Sucessfully Added ${data.vg_name}`);
          return data;
        })
        .catch(error => {
          console.log('ERROR:', error);
        })
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const express = require("express");
//import apollo server
const { ApolloServer } = require("apollo-server-express");
//import our typedefs and resolvers
const path = require("path");
//db connection
const db = require("./config/connection");
const routes = require("./routes");
const app = express();
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
//express server

const PORT = process.env.PORT || 3001;
//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
//middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
app.use(routes);

//apply apollo server with express app
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍API server running on port ${PORT}!`);
      //log where we can go to test out gql api
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

startApolloServer(typeDefs, resolvers);

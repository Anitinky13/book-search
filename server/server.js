const express = require("express");
//import apollo server
const { ApolloServer } = require("apollo-server-express");
//import our typedefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const path = require("path");
//db connection
const db = require("./config/connection");
const routes = require("./routes");

//express server
const app = express();
const PORT = process.env.PORT || 3001;
//middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});
//apply apollo server with express app
server.applyMiddleware({ app });
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`🌍API server running on port ${PORT}!`);
    //log where we can go to test out gql api
    console.log(`Use GraphWL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});

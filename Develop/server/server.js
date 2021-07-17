const express = require('express');
const path = require('path');
const db = require('./config/connection');
// const routes = require('./routes');

//implement the apollo server and apply it to the express server as middleware
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas')
const { authMiddleWare} = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleWare
});

server.applyMiddleWare({app})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// app.use(routes);
app.get('*', (res, req)=>{
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
} )

db.once('open', () => {
  app.listen(PORT, () => {
  console.log(`🌍 Now listening on localhost:${PORT}`)
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  });
});

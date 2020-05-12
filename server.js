import express from 'express';
import bodyParser from 'body-parser';
import {ApolloServer} from 'apollo-server-express'
import mongoose from 'mongoose'
const { typeDefs } = require("./typeDefs/typeDefs");
const { resolvers } = require("./resolvers/resolvers");
const { getPayload } = require("./middleware/utils")

const PORT = 3000;
const app = express();
app.use(bodyParser.json())

const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => {
        const token = req.headers.authorization || '';
        const { payload: user, loggedIn } = getPayload(token);
        return { user, loggedIn }
    }

});
mongoose
  .connect('mongodb://localhost:27017/login-apollo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Bien connecté à la base')
  })
  .catch((error) => {
    console.log(error)
  })


apolloServer.applyMiddleware({app});

app.listen(PORT, ()=>{
    console.log(`🚀Le serveur tourne sur le port : ${PORT} 🚀`)
})
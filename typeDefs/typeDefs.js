const { gql } = require('apollo-server');

const userType = gql`
    type User {
        username: String!,
        password: String,
        token: String
    }
`

const query = gql`
    type Query{
        me: User
    }
    type Mutation {
        register(username: String!, password: String!): User
        login(username : String!, password: String!): User
    }
`
const typeDefs = [query, userType]

module.exports = {
    typeDefs
}
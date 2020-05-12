const { getToken, encryptpassword, comparePassword } = require("./../middleware/utils")
const { AuthenticationError } = require('apollo-server');
const User = require('../models/userModels')

const userResolvers = {
    Query: {
        me: (parent, args, context, info) => {
            console.log(context.loggedIn)
            if (context.loggedIn) {
                return {...context.user, password: null}
            } else {
                throw new AuthenticationError("Please login ")
            }
        }
    },
    Mutation: {
        register: async (parent, args, context, info) => {
            const newUser = { username: args.username, password: await encryptpassword(args.password) }
            const user = await User.findOne({ username: args.username })
            if (user) {
                throw new AuthenticationError("User Exists!")

            }
            try {
                const registerNewUser = new User(newUser)
                const registerUser = await registerNewUser.save()
                const token = getToken(newUser)

                return { ...registerUser._doc, password: null, token }

            } catch (err) {
                throw err
            }
        },
        login: async (parent, args, context, info) => {
            const user = await User.findOne({ username: args.username })
            if (!user) {
                throw new AuthenticationError("Please try again")
            }
            const passwordValid = await comparePassword(args.password, user.password)
            if (!passwordValid) {
                throw new AuthenticationError("Please try again")
            }
            const token = getToken({ username: user.username })

            return { ...user._doc, password: null, token }

        }

    }
}

module.exports = {
    userResolvers
}
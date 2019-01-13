const { GraphQLServer } = require('graphql-yoga')

const users = require('../data/users.json')
const entries = require('../data/entries.json')


const resolvers = {
    Query: {
        info: () => 'This is a sample To-Do list app',

        list: () => {
            // this function could execution a DB query or read a file or call another API
            return entries
        },
        users: () => users,
        getEntryById: (parent, queryArgs) => {
            // because this is a top-level query... `parent` will always be empty
            // `queryArgs` are anything passed in the parenthesis when doing a query

            // the gist of this function basically tells GraphQL how to find a single entry by its ID
            const match = entries.find(entry => entry.id === queryArgs.id)

            if (match) {
                return match
            } else {
                throw new Error('Entry not found')
            }
        }
    },

    Mutation: {
        addEntry: (parent, queryArgs) => {
            // again... because this is a top-level thing (in this case a mutation)... `parent` will always be empty
            // this function could also do some type of DB insert
            const newEntry = {
                id: `entry-${Math.round(Math.random() * 100)}`,
                description: queryArgs.description,
                createdOn: Date(),
                isMarked: queryArgs.isMarked || false,
                owner: 'user-2'
            }

            entries.push(newEntry)
            return newEntry
        },

        deleteEntry: (parent, queryArgs) => {
            const targetIndex = entries.findIndex(entry => entry.id === queryArgs.id)
            const deletedEntries = entries.splice(targetIndex, 1)

            return deletedEntries.length > 0
        },

        updateEntry(parent, queryArgs) {
            const targetIndex = entries.findIndex(entry => entry.id === queryArgs.id)

            if (targetIndex === -1) {
                throw new Error('Entry not found')
            }

            const existingEntry = entries[targetIndex]

            const updatedEntry = Object.assign({}, existingEntry, queryArgs)

            entries.splice(targetIndex, 1, updatedEntry)

            return updatedEntry
        }
    },

    Entry: {
        owner: (parent) => {
            /* basically the corresponding "Entry" object
            something like this:
            {
              "id": "entry-1",
              "description": "This is the first entry",
              "owner": "user-1",
              "isMarked": false,
              "createdOn": "Friday 12, 2019"
            }
             */
            return users.find(user => parent.owner === user.id)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: `${__dirname}/schema.graphql`,
    resolvers
})

server.start(() => console.log('Up and running on port 4000'))
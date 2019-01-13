const { GraphQLServer } = require('graphql-yoga')

const TaskController = require('./TaskController')
const UserController = require('./UserController')


const resolvers = {
    Query: {
        info: () => 'This is a sample To-Do list API',

        tasks: () => {
            // this function could execution a DB query or read a file or call another API
            return TaskController.list()
        },
        users: () => UserController.list(),
        getTaskById: (parent, queryArgs) => {
            // because this is a top-level query... `parent` will always be empty
            // `queryArgs` are anything passed in the parenthesis when doing a query
            return TaskController.getById(queryArgs.id)
        },
        getUserById: (parent, queryArgs) => {
            return UserController.getById(queryArgs.id)
        }
    },

    Mutation: {
        addTask(parent, queryArgs) {
            return TaskController.add(queryArgs)
        },

        deleteTask (parent, queryArgs) {
            return TaskController.delete(queryArgs.id)
        },

        updateTask(parent, queryArgs) {
            return TaskController.update(queryArgs)
        },

        addUser(parent, queryArgs) {
            return UserController.add(queryArgs)
        },

        deleteUser(parent, queryArgs) {
            return UserController.delete(queryArgs.id)
        },

        updateUser(parent, queryArgs) {
            return UserController.update(queryArgs)
        }
    },

    User: {
        tasks: (parent) => {
            return TaskController.getByUser(parent.id)
        }
    },

    Task: {
        owner: (parent) => {
            /* basically the corresponding "Task" object
            something like this:
            {
              "id": "task-1",
              "description": "This is the first task",
              "owner": "user-1",
              "isMarked": false,
              "createdOn": "Friday 12, 2019"
            }
             */
            return UserController.getById(parent.owner)
        }
    }
}

const server = new GraphQLServer({
    typeDefs: `${__dirname}/schema.graphql`,
    resolvers
})

server.start(() => console.log('Up and running on port 4000'))
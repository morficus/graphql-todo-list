const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const USERS_DATA_FILE = `${__dirname}/../data/users.json`

module.exports = {
    /**
     * Get a list of all Users
     * @returns {Promise<array>}
     */
    async list() {
        const users = await readFile(USERS_DATA_FILE, 'utf8')
        return JSON.parse(users)
    },

    /**
     * Get a specific user based on its ID
     * @param {String} userId
     * @returns {Promise<object>}
     */
    async getById(userId) {
        console.log('-- calling "UserController.getById()"')
        const users = await this.list()
        const match = users.find(user => user.id === userId)

        if (match) {
            return match
        } else {
            throw new Error('User not found')
        }
    },

    /**
     * Add a new user to the system
     * @param {String} user
     * @returns {Promise<object>}
     */
    async add(user) {
        console.log('-- calling "UserController.add()"')
        const users = await this.list()

        const newUser = {
            id: `user-${Math.round(Math.random() * 100)}`,
            name: user.name
        }

        users.push(newUser)

        await writeFile(USERS_DATA_FILE, JSON.stringify(users, null, 2))
        return newUser
    },

    /**
     * Update an existing user
     * @param {Object} updatedUser
     * @returns {Promise<object>}
     */
    async update(updatedUser) {
        console.log('-- calling "UserController.update()"')
        const users = await this.list()

        const targetIndex = users.findIndex(user => user.id === updatedUser.id)

        if (targetIndex === -1) {
            throw new Error('User not found')
        }

        const existingUser = users[targetIndex]

        const user = Object.assign({}, existingUser, updatedUser)

        users.splice(targetIndex, 1, user)

        await writeFile(USERS_DATA_FILE, JSON.stringify(users, null, 2))

        return user
    },

    /**
     * Delete a user based on their ID
     * @param {String} userId
     * @returns {Promise<boolean>}
     */
    async delete(userId) {
        console.log('-- calling "UserController.delete()"')
        const users = await this.list()
        const targetIndex = users.findIndex(user => user.id === userId)

        if (targetIndex === -1) {
            throw new Error('User not found')
        }
        const deletedUsers = users.splice(targetIndex, 1)

        await writeFile(USERS_DATA_FILE, JSON.stringify(users, null, 2))

        return deletedUsers.length > 0
    },
}
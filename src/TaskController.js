const fs = require('fs')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const TASK_DATA_FILE = `${__dirname}/../data/tasks.json`

const UserController = require('./UserController')

module.exports = {
    /**
     * Get a list of all Tasks
     * @returns {Promise<array>}
     */
    async list() {
        const tasks = await readFile(TASK_DATA_FILE, 'utf8')
        return JSON.parse(tasks)
    },

    /**
     * Get a specific task based on its ID
         * @param {String} taskId
     * @returns {Promise<object>}
     */
    async getById(taskId) {
        const tasks = await this.list()
        const match = tasks.find(task => task.id === taskId)

        if (match) {
            return match
        } else {
            throw new Error('Task not found')
        }
    },

    /**
     * Get a list of tasks that belong to a specific user
     * @param {String} userId
     * @returns {Promise<array>}
     */
    async getByUser(userId) {
        const tasks = await this.list()
        return tasks.filter(task => task.owner === userId)
    },

    /**
     * Add a new task to the list
     * @param {String} task
     * @returns {Promise<object>}
     */
    async add(task) {
        const user = await UserController.getById(task.owner)
        if (!user) {
            throw new Error(`Did not create the task because there is no such user - ${task.owner}`)
        }

        const tasks = await this.list()

        const newTask = {
            id: `task-${Math.round(Math.random() * 100)}`,
            description: task.description,
            createdOn: Date(),
            isStared: task.isStared || false,
            isComplete: task.isComplete || false,
            owner: task.owner
        }

        tasks.push(newTask)

        await writeFile(TASK_DATA_FILE, JSON.stringify(tasks, null, 2))
        return newTask
    },

    /**
     * Update an existing task
     * @param {Object} updatedTask
     * @returns {Promise<object>}
     */
    async update(updatedTask) {
        const tasks = await this.list()

        const targetIndex = tasks.findIndex(task => task.id === updatedTask.id)

        if (targetIndex === -1) {
            throw new Error('Task not found')
        }

        const existingTask = tasks[targetIndex]

        const task = Object.assign({}, existingTask, updatedTask)

        tasks.splice(targetIndex, 1, task)

        await writeFile(TASK_DATA_FILE, JSON.stringify(tasks, null, 2))

        return task
    },

    /**
     * Delete an task based on its ID
     * @param {String} taskId
     * @returns {Promise<boolean>}
     */
    async delete(taskId) {
        const tasks = await this.list()
        const targetIndex = tasks.findIndex(task => task.id === taskId)

        if (targetIndex === -1) {
            throw new Error('Task not found')
        }
        const deletedEntries = tasks.splice(targetIndex, 1)

        await writeFile(TASK_DATA_FILE, JSON.stringify(tasks, null, 2))

        return deletedEntries.length > 0
    },
}
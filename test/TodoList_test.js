const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
    before(async () => {
        this.todoList = await TodoList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists tasks', async () => {
        const taskCount = await this.todoList.taskCount()
        const task = await this.todoList.tasks(taskCount)
    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('A new task', 0, true)
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        const event = result.logs[0].args
    })

    it('toggles task completion', async () => {
        const result = await this.todoList.toggleCompleted(0)
        const task = await this.todoList.tasks(0);
        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 0)
        assert.equal(event.completed, true)
    })

    it('date is specified', async () => {
        const task = await this.todoList.tasks(0)
        const date = task[3]
        console.log("date: " + new Date(date * 1000));
    })
}) 
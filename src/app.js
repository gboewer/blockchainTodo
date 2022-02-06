App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadWeb3: async () => {
        window.addEventListener('load', async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                window.web3 = new Web3(ethereum);
                try {
                    // Request account access if needed
                    await ethereum.request({ method: 'eth_requestAccounts' });
                    // Acccounts now exposed
                    web3.eth.sendTransaction({/* ... */});
                } catch (error) {
                    // User denied account access...
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                window.web3 = new Web3(web3.currentProvider);
                // Acccounts always exposed
                web3.eth.sendTransaction({/* ... */});
            }
            // Non-dapp browsers...
            else {
                console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
            }
        });
    },
    
    loadAccount: async () => {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        App.account = accounts[0];
    },

    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
        App.todoList = await App.contracts.TodoList.deployed();
    },

    render: async () => {
        // prevent double render
        if(App.loading){
            return
        }

        App.setLoading(true);

        // render account
        $('#account').html(App.account);

        await App.renderTasks()

        App.setLoading(false);
    },

    renderTasks: async () => {
        // load tasks from blockchain
        const taskCount = await App.todoList.taskCount();
        const $taskTemplate = $('.taskTemplate')

        // render tasks with task template
        for(var i = 0; i < taskCount; i++){
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
            const taskDate = task[3]
            const taskDateIncluded = task[4]
            // learn what words and concepts mean that you need to know first like what are blocks vs transactions, what is mining and how does it work, does 
            // every block need to be mined, if every block has to be mined first then how can authors of transactions to it immediately.

            let taskDateObject = new Date(taskDate * 1000)
            let contentText
            if(taskDateIncluded)
                contentText = `${taskContent} (${taskDateObject})`
            else contentText = taskContent

            $('#tasksList').append($('<li></li>').text(contentText))
        }
    },

    createTask: async (content, date, dateIncluded) => {
        console.log(App.account)
        await App.todoList.createTask("test", 0, false, {from: App.account})
        //await App.todoList.createTask(content, date, dateIncluded, {from: App.account})
    },

    toggleCompleted : async (e) => {
        App.setLoading(true);
        const taskId = e.target.name
        await App.todoList.toggleCompleted(taskId, {from: App.account})
        window.location.reload();
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide() 
        } else {
            loader.hide()
            content.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load();
    })

    $(document).on('submit', 'form', (e) => {
        e.preventDefault()

        contentInput = $('#contentInput')
        dateInput = $('#dateInput') 
        dateIncludedCb = $('#dateIncludedCb')

        taskContent = contentInput.val()
        taskDate = dateInput.val()
        includeDate = dateIncludedCb.prop("checked")

        console.log(taskContent + "," + taskDate + "," + includeDate)

        App.createTask(taskContent, 0, true)

        window.location.reload()
    })
})
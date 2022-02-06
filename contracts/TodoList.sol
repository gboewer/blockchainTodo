pragma solidity >=0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        uint256 date;
        bool dateIncluded;
    }

    mapping(uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string content,
        bool completed,
        uint256 date,
        bool dateIncluded
    );

    event TaskCompletionChanged(
        uint id,
        bool completed
    );

    constructor() public {
        createTask("Get that bread", 0, true);
    }

    function createTask(string memory _content, uint256 _date, bool _dateIncluded) public {
        //tasks[taskCount] = Task(taskCount, _content, false, _date, _dateIncluded);
        //emit TaskCreated(taskCount, _content, false, _date, _dateIncluded);
        //taskCount++;
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompletionChanged(_id, _task.completed);
    }
}
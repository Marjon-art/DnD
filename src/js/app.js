import Task from "./Task";

const container = document.querySelector(".container");

const tasks = container.querySelectorAll(".task");
const task1 = tasks[0];

const containerTasks = document.createElement("div");
containerTasks.classList.add("container-tasks");
task1.append(containerTasks);

const tasksTodo = new Task(containerTasks, "todo");
["Hello to Trello!", "This is a card.", "Click on a card to see what's behind it."].forEach(text => tasksTodo.addCard(text));

const tasksInProgress = new Task(containerTasks, "in progress");
["Invite your team to this board using the Add Members button", "Drag people onto a card to indicate that they's responsible for it."].forEach(text => {
  tasksInProgress.addCard(text);
});

const tasksDone = new Task(containerTasks, "done");
["To learn more tricks, check out the guide."].forEach(text => tasksDone.addCard(text));

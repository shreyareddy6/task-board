// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
// Date picker
const dateInput = $("#datepicker");
// form element
const taskForm = $("#taskForm");
// task data from form
const taskTitleInput = $("#taskTitleInput");
const taskDateInput = $("#datepicker");
const taskDescriptionInput = $("#taskDescription");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return crypto.randomUUID();
}

function printTaskData() {
  const tasks = renderTaskList();

  // Empty existing task cards out of the lanes
  const todoList = $("#todo-cards");
  todoList.empty();

  const inProgressList = $("#in-progress-cards");
  inProgressList.empty();

  const doneList = $("#done-cards");
  doneList.empty();

  // Loop through tasks and create task cards for each status
  for (let task of tasks) {
    if (task.status === "to-do") {
      todoList.append(createTaskCard(task));
    } else if (task.status === "in-progress") {
      inProgressList.append(createTaskCard(task));
    } else if (task.status === "done") {
      doneList.append(createTaskCard(task));
    }
  }

  // Use JQuery UI to make task cards draggable
  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass("ui-draggable")
        ? $(e.target)
        : $(e.target).closest(".ui-draggable");
      // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}
// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>")
    .addClass("card task-card draggable my-3")
    .attr("data-task-id", task.id);
  const cardHeader = $("<div>").addClass("card-header h4").text(task.title);
  const cardBody = $("<div>").addClass("card-body");
  const cardDescription = $("<p>").addClass("card-text").text(task.description);
  const cardDueDate = $("<p>").addClass("card-text").text(task.dueDate);
  const cardDeleteBtn = $("<button>")
    .addClass("btn btn-danger delete")
    .text("Delete")
    .attr("data-task-id", task.id);
  cardDeleteBtn.on("click", handleDeleteTask);

  if (task.dueDate && task.status !== "done") {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, "DD/MM/YYYY");

    //If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, "day")) {
      taskCard.addClass("bg-warning text-white");
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass("bg-danger text-white");
      cardDeleteBtn.addClass("border-light");
    }
  }

  //Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  //Return the card so it can be appended to the correct lane.
  return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  if (!tasks) {
    tasks = [];
  }

  return tasks;
}
// function to save the tasks to local storage
function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  //   read data from input fields
  const taskTitle = taskTitleInput.val().trim();
  const taskDueDate = taskDateInput.val(); // yyyy-mm-dd format
  const taskDescription = taskDescriptionInput.val();

  //   creating new task object
  const newTask = {
    // Here we use a Web API called `crypto` to generate a random id for our task. This is a unique identifier that we can use to find the task in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    id: generateTaskId(),
    title: taskTitle,
    dueDate: taskDueDate,
    description: taskDescription,
    status: "to-do",
  };
  //   pulling the stored tasks from local storage
  const tasks = renderTaskList();
  tasks.push(newTask);

  //   save the updated taks to local storage
  saveTasksToStorage(tasks);

  //   print data in correct lanes
  printTaskData();

  taskTitleInput.val("");
  taskDateInput.val("");
  taskDescriptionInput.val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(this).attr("data-task-id");
  const tasks = renderTaskList();

  // Remove task from the array
  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });

  saveTasksToStorage(tasks);

  printTaskData();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  //Read tasks from localStorage
  const tasks = renderTaskList();

  //Get the task id from the event
  const taskId = ui.draggable[0].dataset.taskId;

  //Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;

  for (let task of tasks) {
    //Find the task card by the `id` and update the task status.
    if (task.id === taskId) {
      task.status = newStatus;
    }
  }
  // Save the updated tasks array to localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));
  printTaskData();
}

// Event listener on submit button
taskForm.on("submit", handleAddTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  printTaskData();
  // Datepicker widget
  $(function () {
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });
  // Make lanes droppable
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
});

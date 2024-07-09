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
function generateTaskId() {}

// Todo: create a function to create a task card
function createTaskCard(task) {}

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
  console.log("in event");
  //   read data from input fields
  const taskTitle = taskTitleInput.val().trim();
  const taskDueDate = taskDateInput.val(); // yyyy-mm-dd format
  const taskDescription = taskDescriptionInput.val();

  //   creating new task object
  const newTask = {
    // Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    id: crypto.randomUUID(),
    title: taskTitle,
    dueDate: taskDueDate,
    description: taskDescription,
    status: "to-do",
  };

  //   pulling the stored tasks from local storage
  const tasks = renderTaskList();
  tasks.push(newTask);
  saveTasksToStorage(tasks);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Event listener on submit button
taskForm.on("submit", handleAddTask);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  console.log("inside");
  // Datepicker widget
  $(function () {
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });
});

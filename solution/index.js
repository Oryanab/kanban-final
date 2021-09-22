'use strict'

// Ignore just for not ganerating tone of errors
const input = parseInt(document.getElementById('input').value)
const btn = document.getElementById('btn')

// clear all localStorage exsist
// localStorage.clear()

// Set Up the DataLists for the first time only
const toDoDataList = []
const inProgressDataList = []
const doneTasksDataList = []

//this function will load any exisiting data from local storage or create empty data values
function readLocalStorageAndCreateDom(localStorage) {
  readLocalToDoItems(localStorage)
  readLocalInProgressItems(localStorage)
  readLocalDoneTasksItems(localStorage)
}
readLocalStorageAndCreateDom(localStorage)

// Reverse the DataList from a string to Json get the info with JSON.parse
function returnLocalStorageString(localStorageItem) {
  const localStorageString = JSON.parse(localStorage[localStorageItem])
  return localStorageString
}

//  add Simple item to the exsisting Data lists
function createLocalStorage(dataKeyItem, taskToAdd) {
  const targetDataList = returnLocalStorageString(dataKeyItem)
  targetDataList.unshift(taskToAdd)
  localStorage.setItem(dataKeyItem, JSON.stringify(targetDataList))
}

// Create the element li to add to every block
function createTaskElement(text) {
  const newTaskElement = document.createElement('li')
  const cancelBtn = document.createElement('span')
  cancelBtn.textContent = 'X'
  cancelBtn.classList.add('cancel-btn')
  newTaskElement.textContent = text
  newTaskElement.appendChild(cancelBtn)
  return newTaskElement
}

// Function create a new To Do element and Add it to the to-Do-Data-List
const submintToDoBtn = document.getElementById('submit-add-to-do')
const inputToDo = document.getElementById('add-to-do-task')
submintToDoBtn.addEventListener('click', (e) => {
  if (inputToDo.value.length > 0) {
    createLocalStorage('to-Do-Data-List', inputToDo.value)
    const toDoDataListArray = returnLocalStorageString('to-Do-Data-List')
    submintToDoBtn.parentElement.children[1].append(
      createTaskElement(toDoDataListArray[0])
    )
  } else {
    alert('Must Insert a Task')
  }
})

// Function create a new In Progress element and Add it to the in-Progress-Data-List
const submintInProgressBtn = document.getElementById('submit-add-in-progress')
const inputInProgress = document.getElementById('add-in-progress-task')
submintInProgressBtn.addEventListener('click', (e) => {
  if (inputInProgress.value.length > 0) {
    createLocalStorage('in-Progress-Data-List', inputInProgress.value)
    const inProgressDataListArray = returnLocalStorageString(
      'in-Progress-Data-List'
    )
    submintInProgressBtn.parentElement.children[1].append(
      createTaskElement(inProgressDataListArray[0])
    )
  } else {
    alert('Must Insert a Task')
  }
})

// Function create a new done-Tasks element and Add it to the done-Tasks-Data-List
const submintDoneTasksBtn = document.getElementById('submit-add-done')
const inputDoneTasks = document.getElementById('add-done-task')

submintDoneTasksBtn.addEventListener('click', (e) => {
  if (inputDoneTasks.value.length > 0) {
    createLocalStorage('done-Tasks-Data-List', inputDoneTasks.value)
    const doneTaskDataListArray = returnLocalStorageString(
      'done-Tasks-Data-List'
    )
    submintDoneTasksBtn.parentElement.children[1].append(
      createTaskElement(doneTaskDataListArray[0])
    )
  } else {
    alert('Must Insert a Task')
  }
})

// delete an item:
// btn.addEventListener('click', (e) => {
//   todos.splice(input, 1)
//   console.log(todos)
//   setLocalStorage()
// })

// this function will read any exisiting To-Do-Items on the local storage or
// create the list if it fails to read
function readLocalToDoItems(localStorage) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  try {
    for (let toDoItem of returnLocalStorageString('to-Do-Data-List')) {
      toDoUlSection.append(createTaskElement(toDoItem))
    }
  } catch (e) {
    localStorage.setItem('to-Do-Data-List', JSON.stringify(toDoDataList))
  }
}

// this function will read any exisiting in-Progress-Items on the local storage or
// create the list if it fails to read
function readLocalInProgressItems(localStorage) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  try {
    for (let inProgressItem of returnLocalStorageString(
      'in-Progress-Data-List'
    )) {
      inProgressUlSection.append(createTaskElement(inProgressItem))
    }
  } catch (e) {
    localStorage.setItem(
      'in-Progress-Data-List',
      JSON.stringify(inProgressDataList)
    )
  }
}

// this function will read any exisiting done-Task on the local storage or
// create the list if it fails to read
function readLocalDoneTasksItems(localStorage) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  try {
    for (let doneTasksItem of returnLocalStorageString(
      'done-Tasks-Data-List'
    )) {
      doneTasksUlSection.append(createTaskElement(doneTasksItem))
    }
  } catch (e) {
    localStorage.setItem(
      'done-Tasks-Data-List',
      JSON.stringify(doneTasksDataList)
    )
  }
}

// Functionality:

const allLiElements = Array.from(document.getElementsByTagName('li'))
allLiElements.forEach((li) => {
  li.addEventListener('click', (e) => {})
})

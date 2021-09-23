'use strict'

// Set up a Counter id
function ganerateId() {
  let randomId = Math.round(Math.random() * 5000 + 1)
  return randomId
}

// read the exisiting local data
function lunchLocalStorage() {
  const localStorageJson = localStorage.getItem('tasks')

  if (!localStorageJson) {
    const localStorageJson = localStorage.setItem(
      'tasks',
      JSON.stringify({
        todo: [],
        'in-progress': [],
        done: [],
      })
    )
  }

  return JSON.parse(localStorageJson)
}

// build all the html based on the data
function buildHtmlStructure(lunchLocalStorage) {
  restoreToDoItems(lunchLocalStorage)
  restoreInProgressItems(lunchLocalStorage)
  restoreDoneItems(lunchLocalStorage)
}
buildHtmlStructure(lunchLocalStorage())

// create the basic data lists
const toDoDataList = []
const inProgressDataList = []
const doneTasksDataList = []

// Need to add every run the info to the lists:
function backUpLocalStorage(lunchLocalStorage) {
  try {
    for (let todo of lunchLocalStorage.todo) {
      toDoDataList.push(todo)
    }
  } catch (e) {}
  try {
    for (let progressTask of lunchLocalStorage['in-progress']) {
      inProgressDataList.push(progressTask)
    }
  } catch (e) {}
  try {
    for (let doneTasks of lunchLocalStorage.done) {
      doneTasksDataList.push(doneTasks)
    }
  } catch (e) {}
}
backUpLocalStorage(lunchLocalStorage())

// add new data data
function CreateNewJsonData(
  toDoDataList,
  inProgressDataList,
  doneTasksDataList
) {
  const NewJsonData = {
    todo: toDoDataList,
    'in-progress': inProgressDataList,
    done: doneTasksDataList,
  }
  return NewJsonData
}

// set the new local data
function setLocalStorage(jsonData) {
  localStorage.setItem('tasks', JSON.stringify(jsonData))
}

// Now We are creating the Function which will take the text inputs and Add to the basic data lists:
// Function create a new To Do element and Add it to the to-Do-Data-List:
const submintToDoBtn = document.getElementById('submit-add-to-do') // Button
const inputToDo = document.getElementById('add-to-do-task') // Inputs field
// Create new To Do element:
submintToDoBtn.addEventListener('click', (e) => {
  if (inputToDo.value.length > 0) {
    toDoDataList.unshift(inputToDo.value)
    submintToDoBtn.parentElement.children[1].prepend(
      createTaskElement(toDoDataList[0])
    )
  } else {
    alert('Must Insert a Task')
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
})

// Function create a new In Progress element and Add it to the in-progress
const submintInProgressBtn = document.getElementById('submit-add-in-progress')
const inputInProgress = document.getElementById('add-in-progress-task')
// Create new in Progress element:
submintInProgressBtn.addEventListener('click', (e) => {
  if (inputInProgress.value.length > 0) {
    inProgressDataList.unshift(inputInProgress.value)
    submintInProgressBtn.parentElement.children[1].prepend(
      createTaskElement(inProgressDataList[0])
    )
  } else {
    alert('Must Insert a Task')
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
})

// Function create a new done-Tasks element and Add it to the done
const submintDoneTasksBtn = document.getElementById('submit-add-done')
const inputDoneTasks = document.getElementById('add-done-task')
// Create new done element:
submintDoneTasksBtn.addEventListener('click', (e) => {
  if (inputDoneTasks.value.length > 0) {
    doneTasksDataList.unshift(inputDoneTasks.value)
    submintDoneTasksBtn.parentElement.children[1].prepend(
      createTaskElement(doneTasksDataList[0])
    )
  } else {
    alert('Must Insert a Task')
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
})

// // ############################## the flow of adding new items

// // step 1: adding new elements to the LocalStorage:
//__________________________________________________________
// toDoDataList.push({ id: 1, conetent: "lalalla" });
// inProgressDataList.push({ id: 1, conetent: "lalalla" });
// doneTasksDataList.push({ id: 1, conetent: "lalalla" });
//__________________________________________________________
// // step 2: Refactoring the LocalStorage with the new data
//__________________________________________________________
// setLocalStorage(
//     CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
//   );
//__________________________________________________________

// //   step 3: Ganerating all the html stracture:
//__________________________________________________________
//   buildHtmlStructure(lunchLocalStorage());
//__________________________________________________________

// //   ############################## the flow of adding new items

// Create the element li to add to every block
function createTaskElement(text) {
  const newTaskElement = document.createElement('li')
  newTaskElement.classList.add('task')
  const cancelBtn = document.createElement('span')
  cancelBtn.textContent = 'X'
  cancelBtn.classList.add('cancel-btn')
  newTaskElement.textContent = text
  //   newTaskElement.appendChild(cancelBtn)
  return newTaskElement
}

// this function will read any exisiting To-Do-Items on the local storage or
// create the list if it fails to read
function restoreToDoItems(lunchLocalStorage) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  try {
    for (let toDoItem of lunchLocalStorage.todo) {
      toDoUlSection.append(createTaskElement(toDoItem))
    }
  } catch (e) {}
}

function restoreInProgressItems(lunchLocalStorage) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  try {
    for (let inProgressItem of lunchLocalStorage['in-progress']) {
      inProgressUlSection.append(createTaskElement(inProgressItem))
    }
  } catch (e) {}
}

function restoreDoneItems(lunchLocalStorage) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  try {
    for (let doneItem of lunchLocalStorage.done) {
      doneTasksUlSection.append(createTaskElement(doneItem))
    }
  } catch (e) {}
}

//User should be able to move tasks with alt + numbers and the new lists data should be saved to local storage (79 ms)

const allLi = Array.from(document.querySelectorAll('.task'))
allLi.forEach((item) => {
  item.addEventListener('mouseover', (e) => {
    item.style.backgroundColor = 'pink'
    document.addEventListener(
      'keydown',
      (f) => {
        if (e.altKey === true && f.keyCode === 49) {
          altNumberRemove(
            e.target.parentElement.classList[0],
            e.target.textContent
          )
          e.target.remove()
          altNumberToDoAdd(e.target.textContent)
          e.stopImmediatePropagation()
        } else if (e.altKey === true && f.keyCode === 50) {
          altNumberRemove(
            e.target.parentElement.classList[0],
            e.target.textContent
          )
          e.target.remove()
          altNumberInProgressAdd(e.target.textContent)
          e.stopImmediatePropagation()
        } else if (e.altKey === true && f.keyCode === 51) {
          altNumberRemove(
            e.target.parentElement.classList[0],
            e.target.textContent
          )
          e.target.remove()
          altNumberDoneTaskAdd(e.target.textContent)
          e.stopImmediatePropagation()
        }
        f.stopPropagation()
      },
      { once: true }
    )
  })
})

function altNumberToDoAdd(text) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  toDoDataList.unshift(text)
  toDoUlSection.append(createTaskElement(toDoDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

function altNumberInProgressAdd(text) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  inProgressDataList.unshift(text)
  inProgressUlSection.append(createTaskElement(inProgressDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

function altNumberDoneTaskAdd(text) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  doneTasksDataList.unshift(text)
  doneTasksUlSection.append(createTaskElement(doneTasksDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

function altNumberRemove(dataClassName, text) {
  returnDataListByName(dataClassName).splice(
    returnDataListByName(dataClassName).indexOf(text),
    1
  )
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

function returnDataListByName(dataClassName) {
  if (dataClassName === 'to-do-tasks') {
    return toDoDataList
  } else if (dataClassName === 'in-progress-tasks') {
    return inProgressDataList
  } else {
    return doneTasksDataList
  }
}

// altNumberRemove(
//   e.target.parentElement.classList[0] this is already the name,
//   e.target.textContent
// )

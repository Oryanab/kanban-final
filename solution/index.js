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

  // this function will add a dubble click event to each item with class Tags, then will enable content editing for the li, then it will add another event - Blur turn on the spliceDataList Method
  newTaskElement.addEventListener('dblclick', (allowContentEdit) => {
    const currentText = newTaskElement.textContent
    newTaskElement.contentEditable = 'true'
    newTaskElement.addEventListener('blur', (saveEdits) => {
      spliceDataList(
        allowContentEdit.target.parentElement.classList[0],
        currentText,
        newTaskElement.textContent
      )
    })
  })
  //   newTaskElement.appendChild(cancelBtn)
  return newTaskElement
}
//###########################################################################
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
//###########################################################################

//User should be able to move tasks with alt + numbers and the new lists data should be saved to local storage (79 ms)
document.addEventListener('keydown', (hoverTaskEvent) => {
  //#########################################
  const allHoveredItems = Array.from(document.querySelectorAll(':hover'))
  const allTaskItems = Array.from(document.getElementsByClassName('task'))
  if (hoverTaskEvent.altKey && hoverTaskEvent.keyCode === 49) {
    allTaskItems.forEach((currentTask) => {
      if (allHoveredItems[allHoveredItems.length - 1] === currentTask) {
        altNumberRemove(
          currentTask.parentElement.classList[0],
          currentTask.textContent
        )
        currentTask.remove()
        altNumberToDoAdd(currentTask.textContent)
      }
    })
  } else if (hoverTaskEvent.altKey && hoverTaskEvent.keyCode === 50) {
    allTaskItems.forEach((currentTask) => {
      if (allHoveredItems[allHoveredItems.length - 1] === currentTask) {
        altNumberRemove(
          currentTask.parentElement.classList[0],
          currentTask.textContent
        )
        currentTask.remove()
        altNumberInProgressAdd(currentTask.textContent)
      }
    })
  } else if (hoverTaskEvent.altKey && hoverTaskEvent.keyCode === 51) {
    allTaskItems.forEach((currentTask) => {
      if (allHoveredItems[allHoveredItems.length - 1] === currentTask) {
        altNumberRemove(
          currentTask.parentElement.classList[0],
          currentTask.textContent
        )
        currentTask.remove()
        altNumberDoneTaskAdd(currentTask.textContent)
      }
    })
  }
})
// this function will get the text of the element being hovered and create and store an element
function altNumberToDoAdd(text) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  toDoDataList.unshift(text)
  toDoUlSection.prepend(createTaskElement(toDoDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

// this function will get the text of the element being hovered and create and store an element
function altNumberInProgressAdd(text) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  inProgressDataList.unshift(text)
  inProgressUlSection.prepend(createTaskElement(inProgressDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

// this function will get the text of the element being hovered and create and store an element
function altNumberDoneTaskAdd(text) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  doneTasksDataList.unshift(text)
  doneTasksUlSection.prepend(createTaskElement(doneTasksDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

// this function will remove the element which has moved from the LocalStorage
function altNumberRemove(dataClassName, text) {
  returnDataListByName(dataClassName).splice(
    returnDataListByName(dataClassName).indexOf(text),
    1
  )
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

// this function will receive the element class name and return its datalist
function returnDataListByName(dataClassName) {
  if (dataClassName === 'to-do-tasks') {
    return toDoDataList
  } else if (dataClassName === 'in-progress-tasks') {
    return inProgressDataList
  } else {
    return doneTasksDataList
  }
}

// Array.from(document.querySelectorAll('.task')).forEach((liItem) => {
//   liItem.addEventListener('dblclick', (allowContentEdit) => {
//     const currentText = liItem.textContent
//     liItem.contentEditable = 'true'
//     liItem.addEventListener('blur', (saveEdits) => {
//       spliceDataList(
//         allowContentEdit.target.parentElement.classList[0],
//         currentText,
//         liItem.textContent
//       )
//     })
//   })
// })

// User Double Click Contribute - this function save the changes by entering the dataList and splice out the previous text and add back the new text in the same location.
function spliceDataList(dataClassName, previousText, newText) {
  returnDataListByName(dataClassName).splice(
    returnDataListByName(dataClassName).indexOf(previousText),
    1,
    newText
  )
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}

/*
User should be able to search between tasks (910 ms)
*/

function displayElementsByQuary() {
  const quaryInputField = document.getElementById('search')
  const toDoUlSection = document.querySelector('.to-do-tasks')
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  const doneTasksUlSection = document.querySelector('.done-tasks')

  quaryInputField.addEventListener('keyup', (e) => {
    Array.from(toDoUlSection.children).filter((item) => {
      if (!item.textContent.includes(e.target.value)) {
        item.style.display = 'none'
      } else {
        item.style.display = 'block'
      }
    })
    Array.from(inProgressUlSection.children).filter((item) => {
      if (!item.textContent.includes(e.target.value)) {
        item.style.display = 'none'
      } else {
        item.style.display = 'block'
      }
    })
    Array.from(doneTasksUlSection.children).filter((item) => {
      if (!item.textContent.includes(e.target.value)) {
        item.style.display = 'none'
      } else {
        item.style.display = 'block'
      }
    })
  })
}
displayElementsByQuary()

/*
 skipped User should be able to save and load their tasks from the api and save it to the local storage
*/
function loadDataFromApi() {
  const toDoDataListNew = []
  const inProgressDataListNew = []
  const doneTasksDataListNew = []
  const load = document.getElementById('load-btn')
  load.addEventListener('click', async (loadApiData) => {
    removeAllTasks()
    const response = await fetch(
      'https://json-bins.herokuapp.com/bin/614b12c84021ac0e6c080ce1'
    )

    const apiJsonData = await response.json()
    apiJsonData.tasks.todo.forEach((toDoApiItem) => {
      try {
        toDoDataListNew.push(toDoApiItem)
        const toDoUlSection = document.querySelector('.to-do-tasks')
        toDoUlSection.prepend(createTaskElement(toDoApiItem))
      } catch (e) {}
    })
    apiJsonData.tasks['in-progress'].forEach((inProgressApiItem) => {
      try {
        inProgressDataListNew.push(inProgressApiItem)
        const inProgressUlSection = document.querySelector('.in-progress-tasks')
        inProgressUlSection.prepend(createTaskElement(inProgressApiItem))
      } catch (e) {}
    })
    apiJsonData.tasks.done.forEach((doneTaskApiItem) => {
      try {
        doneTasksDataListNew.push(doneTaskApiItem)
        const doneTasksUlSection = document.querySelector('.done-tasks')
        doneTasksUlSection.prepend(createTaskElement(doneTaskApiItem))
      } catch (e) {}
    })

    setLocalStorage(
      CreateNewJsonData(
        toDoDataListNew,
        inProgressDataListNew,
        doneTasksDataListNew
      )
    )
  })
}

loadDataFromApi()

/*
 User should be save tasks from the api
*/

function saveDataToApi() {
  const save = document.getElementById('save-btn')
  save.addEventListener('click', async (saveToApiData) => {
    const response = await fetch(
      'https://json-bins.herokuapp.com/bin/614b12c84021ac0e6c080ce1',
      {
        method: 'put',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: {
            todo: lunchLocalStorage().todo,
            'in-progress': lunchLocalStorage()['in-progress'],
            done: lunchLocalStorage().done,
          },
        }),
      }
    )

    if (!response.ok) {
      alert(
        'Sorry there may have been an error saving the data pls try again, Error Status: ' +
          response.statusText
      )
    } else {
      alert('sucess')
    }

    // return await response.json()
  })
}
saveDataToApi()

/// if you get here all thats left to delet is the new lists
function removeAllTasks() {
  Array.from(document.querySelectorAll('.task')).forEach((task) => {
    task.remove()
  })
}

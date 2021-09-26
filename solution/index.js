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
  inputToDo.value = ''
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
  inputInProgress.value = ''
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
  inputDoneTasks.value = ''
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
  newTaskElement.textContent = text
  // add draggable feature for the draf&drop feature
  newTaskElement.setAttribute('draggable', 'true')
  dragDrop(newTaskElement)
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
  return newTaskElement
}
//###########################################################################
// this function will read any exisiting To-Do-Items on the local storage or
// create the list if it fails to read
function restoreToDoItems(lunchLocalStorage) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  try {
    for (let toDoItem of lunchLocalStorage.todo) {
      toDoUlSection.appendChild(createTaskElement(toDoItem))
    }
  } catch (e) {}
}

function restoreInProgressItems(lunchLocalStorage) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  try {
    for (let inProgressItem of lunchLocalStorage['in-progress']) {
      inProgressUlSection.appendChild(createTaskElement(inProgressItem))
    }
  } catch (e) {}
}

function restoreDoneItems(lunchLocalStorage) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  try {
    for (let doneItem of lunchLocalStorage.done) {
      doneTasksUlSection.appendChild(createTaskElement(doneItem))
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
  const load = document.getElementById('load-btn')
  load.addEventListener('click', async (loadApiData) => {
    createLoader()
    removeAllTasks()
    const response = await fetch(
      'https://json-bins.herokuapp.com/bin/614b12c84021ac0e6c080ce1'
    )

    const apiJsonData = await response.json()
    toDoDataList.length = 0
    inProgressDataList.length = 0
    doneTasksDataList.length = 0
    apiJsonData.tasks.todo.forEach((toDoApiItem) => {
      try {
        toDoDataList.push(toDoApiItem)
        const toDoUlSection = document.querySelector('.to-do-tasks')
        toDoUlSection.appendChild(createTaskElement(toDoApiItem))
        console.log(toDoDataList)
      } catch (e) {}
    })
    apiJsonData.tasks['in-progress'].forEach((inProgressApiItem) => {
      try {
        inProgressDataList.push(inProgressApiItem)
        const inProgressUlSection = document.querySelector('.in-progress-tasks')
        inProgressUlSection.appendChild(createTaskElement(inProgressApiItem))
      } catch (e) {}
    })
    apiJsonData.tasks.done.forEach((doneTaskApiItem) => {
      try {
        doneTasksDataList.push(doneTaskApiItem)
        const doneTasksUlSection = document.querySelector('.done-tasks')
        doneTasksUlSection.appendChild(createTaskElement(doneTaskApiItem))
      } catch (e) {}
    })

    setLocalStorage(
      CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
    )
    removeLoader()
    location.reload()
  })
}

loadDataFromApi()

/*
 User should be save tasks from the api
*/

function saveDataToApi() {
  const save = document.getElementById('save-btn')
  save.addEventListener('click', async (saveToApiData) => {
    createLoader()
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
      removeLoader()
      alert(
        'Sorry there may have been an error saving the data pls try again, Error Status: ' +
          response.statusText
      )
    } else {
      removeLoader()
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

function createLoader() {
  const loading = document.createElement('div')
  loading.setAttribute('id', 'loader')
  loading.classList.add('loader')

  const imageLoader = document.createElement('img')
  imageLoader.setAttribute(
    'src',
    'https://okimready.org/wp-content/themes/rxforchange/images/loading.gif'
  )

  loading.appendChild(imageLoader)
  document.body.appendChild(loading)
}

function removeLoader() {
  const loaderRemove = document.getElementById('loader')
  loaderRemove.remove()
}

/*
 Implement drag-and-drop sorting of tasks.
  Implement drag-and-drop sorting of tasks.
   Implement drag-and-drop sorting of tasks.
    Implement drag-and-drop sorting of tasks.
     Implement drag-and-drop sorting of tasks.
*/
// every element has a class task
const tasks = document.querySelectorAll('.task')
// every container is a ul
const containers = document.querySelectorAll('ul')

function dragDrop(task) {
  task.addEventListener('dragstart', (e) => {
    task.classList.add('dragging')
    altNumberRemove(task.parentElement.classList[0], task.textContent)
  })
  task.addEventListener('dragend', (e) => {
    task.classList.remove('dragging')
    try {
      if (task.parentElement.classList[0] === 'to-do-tasks') {
        const toDoUlSection = document.querySelector('.to-do-tasks')
        toDoDataList.unshift(task.textContent)
        setLocalStorage(
          CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
        )
      } else if (task.parentElement.classList[0] === 'in-progress-tasks') {
        const inProgressUlSection = document.querySelector('.in-progress-tasks')
        inProgressDataList.unshift(task.textContent)
        setLocalStorage(
          CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
        )
      } else {
        const doneTasksUlSection = document.querySelector('.done-tasks')
        doneTasksDataList.unshift(task.textContent)
        setLocalStorage(
          CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
        )
      }
    } catch (e) {}
  })
}

// tasks.forEach((task) => {
//   task.addEventListener('dragstart', (e) => {
//     task.classList.add('dragging')
//     altNumberRemove(task.parentElement.classList[0], task.textContent)
//   })
//   task.addEventListener('dragend', (e) => {
//     task.classList.remove('dragging')
//     try {
//       if (task.parentElement.classList[0] === 'to-do-tasks') {
//         const toDoUlSection = document.querySelector('.to-do-tasks')
//         toDoDataList.unshift(task.textContent)
//         setLocalStorage(
//           CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
//         )
//       } else if (task.parentElement.classList[0] === 'in-progress-tasks') {
//         const inProgressUlSection = document.querySelector('.in-progress-tasks')
//         inProgressDataList.unshift(task.textContent)
//         setLocalStorage(
//           CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
//         )
//       } else {
//         const doneTasksUlSection = document.querySelector('.done-tasks')
//         doneTasksDataList.unshift(task.textContent)
//         setLocalStorage(
//           CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
//         )
//       }
//     } catch (e) {}
//   })
// })

containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    const task = document.querySelector('.dragging')
    // issue new elements are not reciving the class dragging
    const afterElement = getDragAfterElement(container, e.clientY)
    // console.log(afterElement)
    if (afterElement === null) {
      container.appendChild(task)
    } else if (container.id === 'trush') {
      try {
        task.remove()
      } catch (e) {}
    } else {
      container.insertBefore(task, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const taskElements = [...container.querySelectorAll('.task:not(.dragging)')]

  return taskElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}

'use strict'

/*
    Aim (lunchLocalStorage): read the exisiting local data and return it
*/
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

/*
    Aim (buildHtmlStructure): build all the html structure based on the local data while lunch page
*/
function buildHtmlStructure(lunchLocalStorage) {
  restoreToDoItems(lunchLocalStorage)
  restoreInProgressItems(lunchLocalStorage)
  restoreDoneItems(lunchLocalStorage)
}
buildHtmlStructure(lunchLocalStorage())

/*
    Aim (data lists): Data lists will store all the current, changed and exisiting tasks after every opration.
*/
const toDoDataList = []
const inProgressDataList = []
const doneTasksDataList = []

/*
    Aim (backUpLocalStorage): insert all the data list with all the task elements on every run.
*/
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

/*
    Aim (CreateNewJsonData): Taks all the data from the Data lists, create and return a json called NewJsonData.
*/
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

/*
    Aim (setLocalStorage): Most Repited and used function, setLocalStorage will take as an input the newly created json from CreateNewJsonData which will include all the data list changes on every run
*/

function setLocalStorage(jsonData) {
  localStorage.setItem('tasks', JSON.stringify(jsonData))
}

/*
   Aim (Creating the Add task Functionality): the add Button events will take the text inputs and Add to our Data lists, in case the input is empty there will be an error message box, else there will be a successmessage box
*/

/*
  Create a new To Do element and Add it to the to-Do-Data-List 
*/
const submintToDoBtn = document.getElementById('submit-add-to-do') // Button
const inputToDo = document.getElementById('add-to-do-task') // Inputs field
submintToDoBtn.addEventListener('click', (e) => {
  if (inputToDo.value.length > 0) {
    toDoDataList.unshift(inputToDo.value)
    submintToDoBtn.parentElement.children[1].prepend(
      createTaskElement(toDoDataList[0])
    )
  } else {
    lunchBadInputMessageBox()
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
  inputToDo.value = ''
})

/*
   Create a new In Progress element and Add it to the in-progress
*/
const submintInProgressBtn = document.getElementById('submit-add-in-progress')
const inputInProgress = document.getElementById('add-in-progress-task')
submintInProgressBtn.addEventListener('click', (e) => {
  if (inputInProgress.value.length > 0) {
    inProgressDataList.unshift(inputInProgress.value)
    submintInProgressBtn.parentElement.children[1].prepend(
      createTaskElement(inProgressDataList[0])
    )
  } else {
    lunchBadInputMessageBox()
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
  inputInProgress.value = ''
})

/*
   Create a new done-Tasks element and Add it to the done
*/

const submintDoneTasksBtn = document.getElementById('submit-add-done')
const inputDoneTasks = document.getElementById('add-done-task')

submintDoneTasksBtn.addEventListener('click', (e) => {
  if (inputDoneTasks.value.length > 0) {
    doneTasksDataList.unshift(inputDoneTasks.value)
    submintDoneTasksBtn.parentElement.children[1].prepend(
      createTaskElement(doneTasksDataList[0])
    )
  } else {
    lunchBadInputMessageBox()
  }
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
  inputDoneTasks.value = ''
})

/*
    Aim (createTaskElement): The function will taks a an input a text and return a Task element, in addion it will change its Attribute to draggable and implement the drag and drop feature, aswell as change its content to contentEditable which allow changing its content by double clicking a task element, then it will return the newly created Task 'LI' element.
*/
function createTaskElement(text) {
  const newTaskElement = document.createElement('li')
  newTaskElement.classList.add('task')
  newTaskElement.textContent = text
  newTaskElement.setAttribute('draggable', 'true')
  dragDrop(newTaskElement)
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

/*
    Aim (restoreToDoItems, restoreInProgressItems, restoreDoneItems): The next 3 Functions will read any exisiting To-Do-Items from the local storage and send all the data from the Data lists which Comes from the lunchLocalStorage and will create Task Elemnts for each item in the Data Lists, and then will append the new Elements to the Ul Sections, the 3 functions will run inside the  buildHtmlStructure right when the page loads.
*/
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

/*
    Aim (move tasks with alt + numbers Functionality): In this section the document will be added an event keydown which will tell whether the alt key, 1, 2 or 3 are now pressed, then by adding the querySelectorAll(':hover'), the document will continuously log a list of all the elements being hovered at the moment to the console. Then a condition will run a check on the last item of that list. First, a Condition continuously checkes whather alt is pressed combined with 1,2 or 3,then if the mouse was last on one od the Elements with a class of 'task', it will move the Element to a section based on the number key and add the element which has joined to the Current section's Data List, After that, remove the element which has moved from its last DataList and Remove the Element from the page by using the altNumberRemove function, then it will save the current state to the LocalStorage using the  altNumberToDoAdd, altNumberInProgressAdd or altNumberDoneTaskAdd. 
*/

document.addEventListener('keydown', (hoverTaskEvent) => {
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
    lunchSuccessMessageBox()
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
      lunchErrorMessageBox()
    } else {
      removeLoader()
      lunchSuccessMessageBox()
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
      try {
        container.insertBefore(task, afterElement)
      } catch (e) {
        lunchDeletedItemMessageBox()
      }
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

// Personal Additon = Button Tool tips based dataset
function toolTip(itemId) {
  const item = document.getElementById(itemId)
  console.log(item)
  const tooltipContent = item.dataset.tooltip
  const tooltipSingle = document.createElement('p')
  tooltipSingle.classList.add('tooltip')
  tooltipSingle.textContent = tooltipContent
  tooltipSingle.style.display = 'none'
  item.addEventListener('mouseover', (e) => {
    tooltipSingle.style.display = 'block'
  })
  item.addEventListener('mouseout', (e) => {
    tooltipSingle.style.display = 'none'
  })

  item.append(tooltipSingle)
}

toolTip('save-btn')
toolTip('load-btn')
toolTip('trush')

// Personal Additon = Message Box For success and Errors

// this function will create the pop up div
function createSuccessMssage(
  messageColor,
  messageTitle,
  message,
  emoji,
  divbackground
) {
  const successMssageBox = document.createElement('div')
  successMssageBox.classList.add('popup')
  successMssageBox.classList.add('center')
  const icon = document.createElement('div')
  icon.classList.add('icon')
  const iconEmoji = document.createElement('i')
  iconEmoji.textContent = emoji
  iconEmoji.classList.add('fa')
  iconEmoji.classList.add('fa-check')
  icon.appendChild(iconEmoji)
  successMssageBox.appendChild(icon)
  const title = document.createElement('div')
  title.classList.add('title')
  title.textContent = messageTitle // success/ Error
  title.style.color = messageColor
  successMssageBox.appendChild(title)
  const description = document.createElement('div')
  description.classList.add('description')
  description.textContent = message // enter the message
  successMssageBox.appendChild(description)
  const dismissBtn = document.createElement('div')
  dismissBtn.classList.add('dismiss-btn')
  const dismissPopupBtn = document.createElement('button')
  dismissPopupBtn.setAttribute('id', 'dismiss-popup-btn')
  dismissPopupBtn.textContent = 'Dismiss'
  dismissPopupBtn.addEventListener('click', RemoveSuccessMssage)
  dismissBtn.appendChild(dismissPopupBtn)
  successMssageBox.appendChild(dismissBtn)
  successMssageBox.setAttribute('id', 'successMssageBox')
  successMssageBox.style.zIndex = 200
  successMssageBox.style.backgroundColor = divbackground
  const body = document.body
  body.append(successMssageBox)
}

// this function will connect to the dismiss function and remove the div
function RemoveSuccessMssage() {
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.remove()
}

// this function will lunch the a Success Div
function lunchSuccessMessageBox() {
  createSuccessMssage(
    'green',
    'Success',
    'Youre On Track, Keep Up!',
    '✔️',
    'white'
  )
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}
// lunchSuccessMessageBox()

// this function will lunch the a Error Div

function lunchErrorMessageBox() {
  createSuccessMssage(
    'red',
    'Error',
    'We are sorry something may have gone wrong, please try again later',
    '❌',
    'white'
  )
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}
// lunchErrorMessageBox()

function lunchBadInputMessageBox() {
  createSuccessMssage('red', 'Error', 'Must Insert a Task', '❌', 'white')
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}

function lunchDeletedItemMessageBox() {
  createSuccessMssage(
    'red',
    'This Item Was Deleted',
    'We are sorry It is not possible to add back an item after sent to trush',
    '❌',
    'white'
  )
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}

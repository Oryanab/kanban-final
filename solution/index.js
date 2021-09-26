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
    Aim (buildHtmlStructure): build all the html structure based on the local data while page lunches
*/
function buildHtmlStructure(lunchLocalStorage) {
  restoreToDoItems(lunchLocalStorage)
  restoreInProgressItems(lunchLocalStorage)
  restoreDoneItems(lunchLocalStorage)
}
buildHtmlStructure(lunchLocalStorage())

/*
    Aim (data lists): Data lists that will store all the current, changed, and existing tasks after every operation.
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
    Aim (CreateNewJsonData): Takes all the data from the Data lists, creates and returns a JSON called NewJsonData.
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
    Aim (setLocalStorage): Most Repeated and used function, setLocalStorage will take as an input the newly created JSON from CreateNewJsonData which will include all the data list changes on every run
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
    Aim (createTaskElement): The function will take an input a text and return a Task element, in addition, it will change its Attribute to draggable and implement the drag and drop feature, as well as changing its content to contentEditable which allow changing its content by double-clicking a task element, then it will return the newly created Task 'LI' element.
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
      newTaskElement.contentEditable = 'false'
    })
  })
  return newTaskElement
}

/*
    Aim (restoreToDoItems, restoreInProgressItems, restoreDoneItems): The next 3 Functions will read any existing To-Do-Items from the local storage and send all the data from the Data lists which Comes from the lunchLocalStorage and will create Task Elements for each item in the Data Lists, and then will append the new Elements to the Ul Sections, the 3 functions will run inside the buildHtmlStructure right when the page loads.
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
    Aim (move tasks with alt + numbers Functionality): In this section, the document will be added an event keydown which will tell whether the alt key, 1, 2, or 3 are now pressed, then by adding the querySelectorAll(':hover'), the document will continuously log a list of all the elements being hovered at the moment to the console. Then a condition will run a check on the last item of that list. First, a Condition continuously checks whether alt is pressed combined with 1,2 or 3, then if the mouse was last on one of the Elements with a class of 'task', it will move the Element to a section based on the number key and add the element which has joined to the Current section's Data List, After that, remove the element which has moved from its last DataList and Remove the Element from the page by using the altNumberRemove function, then it will save the current state to the LocalStorage using the altNumberToDoAdd, altNumberInProgressAdd or altNumberDoneTaskAdd. 
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

/*
    Aim (altNumberToDoAdd, altNumberInProgressAdd, altNumberDoneTaskAdd): Functions will receive the element which was passed textContent and add it to the beginning of the New Section's Data List, then it will also create a new Task Element of that textContent and add it to the beginning of the Section. Then it will save the changes of the Data Lists to the Local Storage using setLocalStorage.
*/
function altNumberToDoAdd(text) {
  const toDoUlSection = document.querySelector('.to-do-tasks')
  toDoDataList.unshift(text)
  toDoUlSection.prepend(createTaskElement(toDoDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}
function altNumberInProgressAdd(text) {
  const inProgressUlSection = document.querySelector('.in-progress-tasks')
  inProgressDataList.unshift(text)
  inProgressUlSection.prepend(createTaskElement(inProgressDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}
function altNumberDoneTaskAdd(text) {
  const doneTasksUlSection = document.querySelector('.done-tasks')
  doneTasksDataList.unshift(text)
  doneTasksUlSection.prepend(createTaskElement(doneTasksDataList[0]))
  setLocalStorage(
    CreateNewJsonData(toDoDataList, inProgressDataList, doneTasksDataList)
  )
}
/*
    Aim (altNumberRemove, returnDataListByName): The returnDataListByName will receive a Data-Class-Name which a name-code to the class of each Ul section, the that it set a condition and relate the Data-Class-Name to section Data List. The altNumberRemove Function will receive two inputs the Data-Class-Name which will run into returnDataListByName, and text which is the textContent of the task element which has moved. By using the Splice Method the returnDataListByName cuts out the task element which has moved by the index of its textContent and then saves the changes of the Data Lists by the function setLocalStorage.
*/

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

/*
    Aim (spliceDataList): This function Contribute the User Double Click Contribute, saving the changes by entering the Data List of the current Edited Task Element and splice out the previous text and add back the new text in the same location.
*/
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
    Aim (displayElementsByQuary): This function used for the 'User should be able to search between tasks', The function takes the value from the input field with an event 'keyup' then checks whether the current Ul.childeren (tasks of each parent Section) includes the value(search key word), if so they will be shown, else, they with disappear by display none. The function is always active and should be called right at the bottom after the function.
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
 Aim (loadDataFromApi): This function used for the 'User should be able to save and load their tasks from the API and save it to the local storage' When the load button gets clicked the function will send a get request to the API, All the Current Data List will be reset by Array.length = 0, then the function will get from the response JSON Sections (todo, 'in-progress & done) the API data and restore it into the Data Lists which will be saved into the localStorage by setLocalStorage function. In case the response JSON from the API is empty of data, the function will catch the error and pass. while awaiting the API response, there will be a loader and at the end a short success message. The function is always active and should be called right at the bottom after the function.
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
 Aim (saveDataToApi): This function used for the 'User should be saved tasks from the API When the save button gets clicked the function will send a post request to the API, the post request will include the current localStorage state using the function lunchLocalStorage() which continuously holders the current state of the localStorage. By clicking save it will change the API Data to the current state of the localStorage, when the request fails an Error massage Box will be shown, otherwise, a success massage Box will be shown. The function is always active and should be called right at the bottom after the function.
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
  })
}
saveDataToApi()

/*
    Aim (removeAllTasks): This function is used at the start of the loadDataFromApi function, the function will select all the elements with a class task and remove them from the page.
*/
function removeAllTasks() {
  Array.from(document.querySelectorAll('.task')).forEach((task) => {
    task.remove()
  })
}

/*
    Aim (createLoader, removeLoader): Those functions responsible for the loader used during the API requests operations save(put) and load(get), on a save or load button click the loader will be lunched and end after the request was complete.
*/
function createLoader() {
  const loading = document.createElement('div')
  loading.setAttribute('id', 'loader')
  loading.classList.add('loader')

  const imageLoader = document.createElement('img')
  imageLoader.setAttribute(
    'src',
    'http://bgiic.ac.in/bgiicnew/images/loading2.gif'
  )

  loading.appendChild(imageLoader)
  document.body.appendChild(loading)
}

function removeLoader() {
  const loaderRemove = document.getElementById('loader')
  loaderRemove.remove()
}

/*
    Aim (drag-drop: Implement drag-and-drop sorting of tasks): The drag and drop functionality is implemented on every task element during its creation.  drag-drop will receive a task element as an input and give it an event 'dragstart', during that event it will be added a class 'dragging', and the task element will be removed from its current Data List by using the altNumberRemove function. when drag is over the task element will receive an event 'dragend', then the class 'dragging' will be removed, and then the function will run a check on its new Parent element (Ul container) and add it to the new Data List, the Save to localStorage with the setLocalStorage Function.
*/
const tasks = document.querySelectorAll('.task')
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

/*
    Aim (containers Event, getDragAfterElement(Implement drag-and-drop sorting of tasks)): Each container will get an event 'dragover', the getDragAfterElement Function will receive two inputs (container, y), the container will be each one of the containers (Ul) on the document, the y will be the clientY of the current container which the task passed to, then it will target inside the container all the task element which currently not being drag by query selector ('.task:not(.dragging)'), then it will make a reduce function on the currently not being drag elements. calculate their current average (box highet and width ) and reduce it from the current container clientY into a variable called offset, then checks if the offset is negative which means it's under another task element and greater than the closest task element offset (the task element which currently below), then return the task element which above the element currently being dragged. if there is not a task element above it will return the closet element (the element blow). 
    Then during the 'dragover' event, a variable called afterElement gets the value of the element which is above the element which currently being dragged, then check if it is equal to null, it will append it, if the container id is trash it will remove the task, else its insert the task Before the element below (afterElement).
    
*/
containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault()
    const task = document.querySelector('.dragging')
    const afterElement = getDragAfterElement(container, e.clientY)
    if (afterElement === null) {
      container.appendChild(task)
    } else if (container.id === 'trush') {
      try {
        task.remove()
        lunchDeletedSuccessfulMessageBox()
      } catch (e) {}
    } else {
      try {
        container.insertBefore(task, afterElement)
      } catch (e) {}
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

/*
    Aim ( Personal Addition = Button Tooltips based dataset: toolTip()): the function will read the dataset 'tooltip' of the element with the function input (itemId) and create a tooltip which will appear during mouse over and remove during 'mouseout'.
*/

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
toolTip('tutorial')

/*
    Aim ( Personal Additon = Message Box For success and Errors: createSuccessMssage(),RemoveSuccessMssage(): the function createSuccessMssage will create the pop up div with the inputs fields (messageColor,messageTitle, message,emoji,divbackground), RemoveSuccessMssage function will connect to the dismiss function and remove the div when clicked, then the rest of the functions (lunchSuccessMessageBox(), lunchErrorMessageBox(), lunchBadInputMessageBox(), lunchDeletedSuccessfulMessageBox()) will lunch different messages popups when being called, and will be removed when dismiss button clicked
*/

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

function RemoveSuccessMssage() {
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.remove()
}

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

function lunchBadInputMessageBox() {
  createSuccessMssage('red', 'Error', 'Must Insert a Task', '❌', 'white')
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}

function lunchDeletedSuccessfulMessageBox() {
  createSuccessMssage(
    'green',
    'Task Deleted',
    'Your Task Was Successfully Removed',
    '✔️',
    'white'
  )
  const successMssageBox = document.getElementById('successMssageBox')
  successMssageBox.classList.add('active')
}

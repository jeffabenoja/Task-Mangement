
const createTaskBtn = document.getElementById('add-new-task-btn');
createTaskBtn.addEventListener('click', function() {
    const taskTitleInput = document.getElementById('task_title');
    const taskTitle = taskTitleInput.value.trim();
    if(taskTitle !== '') {
        // Check if we are in "Edit Task" mode
        const editMode = document.getElementById('add_new_task').textContent === 'Edit Task';

        if (editMode) {
            // Get the selected task and column
            const taskStatus = document.getElementById('colName').textContent;
            const selectedColumn = currentBoard.columns.find(column => column.title === taskStatus);

            // Check if the task_title element exists before accessing its value
            const taskTitleAttribute = taskTitleInput.getAttribute('data-task-title');
            const selectedTaskTitle = taskTitleAttribute ? taskTitleAttribute : '';

            const selectedTask = selectedColumn.tasks.find(task => task.title === selectedTaskTitle);

            // Call the editTask() function to update the task with the edited information
            editTask(selectedTask);
        } else {
            // If we are in "Add Task" mode, call the newTask() function
            newTask();
        }
    } else {
        const inputFields = document.querySelectorAll('.task__modal input');

        inputFields.forEach(inputs => {
            if(inputs.value === '') {
                inputs.classList.add('empty__inputFields');
            }
        });
    }
});

const newTask = () => {
  // Get the input values for the task
  const taskTitleInput = document.getElementById('task_title');
  const taskDescriptionInput = document.querySelector('.text__area');
  const subtaskFields = document.querySelectorAll('.subtask__field');
  const taskStatus = document.getElementById('colName').textContent;

    // Create an object to represent the new task
    const newTask = {
        title: taskTitleInput.value.trim(),
        description: taskDescriptionInput.value.trim(),
        subtasks: [],
    };

    // Add the subtasks to the new task object
    subtaskFields.forEach(subtask => {
        const subtaskTitle = subtask.value.trim();
        if (subtaskTitle !== '') {
            newTask.subtasks.push({ title: subtaskTitle, done: false }); // Include 'done' property for subtasks
        }
    });

    // Add the new task to the specific column based on the taskStatus
    const selectedColumn = currentBoard.columns.find(column => column.title === taskStatus);
    if (selectedColumn) {
        selectedColumn.tasks.push(newTask);
    }

    // Update local storage with the new task
    updateLocalStorage();

    // Clear the input fields after creating the task
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    subtaskFields.forEach(subtask => (subtask.value = ''));

    // Close the task modal after creating the task
    const taskContainer = document.querySelector('.main_task__modal');
    taskContainer.style.display = 'none';

    // Now, you can re-render the columns to display the new task
    renderColumns(currentBoard);
    
};

const editTask = (selectedTask) => {
    // Get the input values for the task
    const taskTitleInput = document.getElementById('task_title');
    const taskDescriptionInput = document.querySelector('.text__area');
    const subtaskFields = document.querySelectorAll('.subtask__field');

    // Update the selected task with the edited information
    selectedTask.title = taskTitleInput.value.trim();
    selectedTask.description = taskDescriptionInput.value.trim();

    selectedTask.subtasks = []; // Clear existing subtasks

    subtaskFields.forEach(subtask => {
        const subtaskTitle = subtask.value.trim();
        if (subtaskTitle !== '') {
            selectedTask.subtasks.push({ title: subtaskTitle, done: false });
        }
    });

    // Update local storage with the edited task
    updateLocalStorage();

    // Close the task modal after editing the task
    const taskContainer = document.querySelector('.main_task__modal');
    taskContainer.style.display = 'none';

    // Reset the task modal back to "Add Task" mode
    resetTaskModal();

    // Re-render the columns to display the edited task
    renderColumns(currentBoard);
};



const updateBoardColumns = (board, columnTitle) => {
    // Check if the columnTitle is not empty and not already present in the columns array
    if (!board.columns.some(column => column.title === columnTitle)) {
      // Add new column to the board object
      board.columns.push({ title: columnTitle, tasks: [] });
      // Update Local Storage
      updateLocalStorage();
    }
};

const setCurrentBoard = (board) => {
    currentBoard = board;
};

const taskList = document.querySelector('.taskColumn_list');
taskList.addEventListener('click', function(e) {
    const target = e.target;

    if(target.matches('li')) {
        const colName = document.getElementById('colName');
        colName.textContent = target.textContent;
        const taskContainer = document.querySelector('.taskColumn__container');
        taskContainer.style.display = 'none';
        taskChevron.src = "http://127.0.0.1:5500/assets/icon-chevron-down.svg";
    }
})

const renderTaskColumnList = (board) => {
    // Clear the taskColumn_list before appending new columns
    const taskColumn_list = document.querySelector('.taskColumn_list');
    taskColumn_list.innerHTML = '';
  
    // Loop through the columns of the current board and append their titles to the taskColumn_list
    board.columns.forEach((column) => {
      const columnTitle = column.title || column.name;
      const taskList = document.createElement('li');
      taskList.classList.add('body-l');
      taskList.textContent = columnTitle;
      taskColumn_list.appendChild(taskList);
    });
};


const attachCardClickListeners = () => {
    const cardButtons = document.querySelectorAll('.card');
    cardButtons.forEach((card) => {
        card.addEventListener('click', function() {
            //Get the parent element with class 'current'
            const currentParent = this.parentElement;

            const prevSibling = currentParent.previousElementSibling;
            
            const text = prevSibling.innerText.replace(/\(.*\)/g, '').replace(/<span>.*<\/span>/g, '');
            const columnTitle = text.trim();

            const selectedColumn = currentBoard.columns.find(column => column.title === columnTitle || column.name === columnTitle);
            if(selectedColumn) {
                const cardTitle = this.querySelector('.card__title').innerText;
                const selectedTask = selectedColumn.tasks.find(task => task.title === cardTitle)
                if(selectedTask) {
                    const taskContainer = document.querySelector('.main_task__modal');
                    taskContainer.style.display = 'block';

                    const addTaskModal = document.querySelector('.task__modal');
                    addTaskModal.style.display = 'none';

                    const updateTask = document.querySelector('.viewTask');
                    updateTask.style.display = 'flex';

                    updateTask.innerHTML = `
                        <div class="card_header flex align-items-center">
                            <h4 id="viewTask_title" class="heading-L">${selectedTask.title}</h4>
                            <button class="header-button ellipsis-task-btn" role="button" aria-pressed="false">
                                <img src="./assets/icon-vertical-ellipsis.svg" alt="Ellipsis Button"/>
                            </button>
                            <div class="ellipsis__task">
                                <p id="edit_task" class="body-l clr-primary-400">Edit Task</p>
                                <p id="delete_task" class="body-l">Delete Task</p>
                            </div>
                        </div>

                        <div>
                            <p class="task_description body-l clr-primary-400"></p>
                        </div>

                        <div class="flex flex-column row-gap-3">
                                <p class="body-m clr-primary-400">
                                    Subtasks ( <span id="subtask_done">0</span> of <span class="subtask_length">${selectedTask.subtasks.length}</span> )
                                </p>
                            <div class="subtask_checkbox"><!-- Subtask labels will be appended here --></div>
                        </div>
                        <div>
                            <p class="body-m clr-primary-400 mb-small">Current Status</p>
                            <div class="current__status flex justify-content-between task__status">
                                <p id="viewColName" class="body-l">${selectedColumn.title || selectedColumn.name}</p>
                                <div class="taskColumn__container">
                                    <ul class="taskColumn_list update_taskColumn">
                                    </ul>
                                </div>
                                <button class="header-button chevron-icon" role="button" aria-pressed="false">
                                    <img 
                                        src="./assets/icon-chevron-down.svg" 
                                        alt="Down navigation" 
                                        id="viewtask-chevron" 
                                    />
                                </button>
                            </div>
                        </div>
                        <div class="flex justify-content-center align-items-center">
                            <button class="header-button body-m border-r-20 primary-btn modal-btn clr-primary-100 move-task-btn" role="button" aria-pressed="false">
                                Move Task
                            </button>
                        </div>
                    `;

                    const taskCaption = document.querySelector('.task_description');

                    if(selectedTask.description === '') {
                        taskCaption.innerText = 'No Description';
                    } else {
                        taskCaption.innerText = selectedTask.description
                    }

                    const subtaskContainer = document.querySelector('.subtask_checkbox');

                    // Get the subtask_done element
                    const subtaskDoneCountElement = updateTask.querySelector('#subtask_done'); 
                    let subtaskDoneCount = 0;
                    subtaskContainer.innerHTML = ''; // Clear previous content

                    // Get the unique identifiers of the clicked card
                    const columnIndex = this.dataset.columnId;
                    const cardIndex = this.dataset.cardId;;

                    selectedTask.subtasks.forEach(subtask => {
                        const subtaskLabel = document.createElement('label');
                        const subtaskInput = document.createElement('input');
                        const subtaskSpan = document.createElement('span');

                        subtaskInput.setAttribute('type', 'checkbox');
                        subtaskInput.classList.add('bg-primary-200', 'me-3');
                        subtaskInput.checked = subtask.done; // Set the checkbox checked state based on 'done' property

                        subtaskSpan.classList.add('subtask-title');
                        subtaskSpan.textContent = subtask.title;

                        // Add event listener to the checkbox to handle changes
                        subtaskInput.addEventListener('change', function() {
                            // Update 'done' property of the subtask
                            subtask.done = this.checked;
                        
                            updateTaskSubtaskStyles(); // Update the styles of the subtask elements
                            updateLocalStorage(); // Save the updated data to local storage

                            // Update the subtaskDoneCount based on the checked status
                            subtaskDoneCount = selectedTask.subtasks.filter(subtask => subtask.done).length;

                            const specificCard = document.querySelector(`.card[data-column-id="${columnIndex}"][data-card-id="${cardIndex}"]`);
                            const subCountCard = specificCard.querySelector('.subtask_done');
                            subCountCard.textContent = subtaskDoneCount;

                            // Update the text content of the subtask_done element
                            subtaskDoneCountElement. textContent = subtaskDoneCount;
                        });

                        subtaskLabel.classList.add('done', 'body-m', 'flex', 'align-items-center', 'p-3');
                        subtaskLabel.appendChild(subtaskInput);
                        subtaskLabel.appendChild(subtaskSpan);

                        subtaskContainer.appendChild(subtaskLabel);
                    });

                    // Initialize the subtaskDoneCount based on the current state of the subtasks
                    subtaskDoneCount = selectedTask.subtasks.filter(subtask => subtask.done).length;
                    subtaskDoneCountElement.textContent = subtaskDoneCount;


                    const viewTaskList = document.querySelector('.current__status .taskColumn_list');
                    
                    viewTaskList.addEventListener('click', function(e) {
                        const target = e.target;

                        if(target.matches('li')) {
                            const currentStatusName = document.getElementById('viewColName');
                            currentStatusName.textContent = '';
                            currentStatusName.textContent = target.textContent;
                            const taskContainer = document.querySelector('.current__status .taskColumn__container');
                            taskContainer.style.display = 'none';

                            const viewTaskChevron = document.querySelector('.current__status #viewtask-chevron');
                            viewTaskChevron.src  = "http://127.0.0.1:5500/assets/icon-chevron-down.svg";


                            if(currentStatusName.innerText !== selectedColumn.title) {
                                // Show the Move button and attach a click event listener
                                const moveButton = document.querySelector('.move-task-btn');
                                moveButton.style.display = 'block';
                                moveButton.addEventListener('click', function() {
                                    handleTaskMove(selectedTask, selectedColumn);
                                });
                            } else {
                                const moveButton = document.querySelector('.move-task-btn');
                                moveButton.style.display = 'none';
                            }
                        }
                    })
                    // Update the styles of the subtask elements
                    updateTaskSubtaskStyles();

                    const deleteTask = document.getElementById('delete_task');
                    deleteTask.addEventListener('click', function() {
                        handleDeleteTask(selectedTask, selectedColumn);
                    });

                    const editTask = document.getElementById('edit_task');
                    editTask.addEventListener('click', function() {
                        const editTaskStatus = document.querySelector('.task__status button');
                        editTaskStatus.style.display = 'none'
                        editTaskFunction(selectedTask, selectedColumn)
                    })
                }
            }
        });
    });
}

const handleTaskMove = (selectedTask, selectedColumn) => {
    const taskContainer = document.querySelector('.main_task__modal');
    const currentStatusName = document.getElementById('viewColName');
  
    if (currentStatusName.innerText !== selectedColumn.title || currentStatusName.innerText !== selectedColumn.name) {
      const selectedTaskIndex = selectedColumn.tasks.findIndex(task => task.title === selectedTask.title);
      selectedColumn.tasks.splice(selectedTaskIndex, 1);
      
      const newColumn = currentBoard.columns.find(column => column.title === currentStatusName.innerText || column.name === currentStatusName.innerText);
      newColumn.tasks.push(selectedTask);
  
      // Update the local storage
      updateLocalStorage();
  
      // Re-render the board and the task column list for the current board
      renderColumns(currentBoard);
      renderTaskColumnList(currentBoard);
  
      // Re-attach click event listeners to the cards
      attachCardClickListeners();
  
      // Close the task modal
      taskContainer.style.display = 'none';
    }
};


const handleDeleteTask = (selectedTask, selectedColumn) => {
    const selectedTaskIndex = selectedColumn.tasks.findIndex(task => task.title === selectedTask.title);
    if(selectedTaskIndex !== -1) {
        selectedColumn.tasks.splice(selectedTaskIndex, 1);

        // Update the local storage
        updateLocalStorage();
        
        // Re-render the board and the task column list for the current board
        renderColumns(currentBoard);
        renderTaskColumnList(currentBoard);
    
        // Re-attach click event listeners to the cards
        attachCardClickListeners();
    
        // Close the task modal
        const taskContainer = document.querySelector('.main_task__modal');
        taskContainer.style.display = 'none';
    }
}



const updateTaskSubtaskStyles = () => {
    const subtaskContainer = document.querySelector('.subtask_checkbox');
    const subtaskInputs = subtaskContainer.querySelectorAll('input[type="checkbox"]');

    subtaskInputs.forEach((subtaskInput) => {
        const subtaskSpan = subtaskInput.nextElementSibling;

        // Apply styles to the subtask title when checked
        if (subtaskInput.checked) {
            subtaskSpan.style.textDecoration = 'line-through';
            subtaskSpan.style.color = 'var(--clr-primary-400)';
        } else {
            subtaskSpan.style.textDecoration = 'none';
            subtaskSpan.style.color = 'inherit';
        }
    });
};

const viewTaskContainer = document.querySelector('.viewTask');
viewTaskContainer.addEventListener('click', function(event) {
  const viewTaskChevron = event.target.closest('#viewtask-chevron');
    if (viewTaskChevron) {
        viewTaskChevron.addEventListener('click', function() {
            // Clear the taskColumn_list before appending new columns
            const updateColumnList = document.querySelector('.update_taskColumn');
            updateColumnList.innerHTML = '';
        
            // Loop through the columns of the current board and append their titles to the taskColumn_list
            currentBoard.columns.forEach((column) => {
                const columnTitle = column.title || column.name;
                const taskList = document.createElement('li');
                taskList.classList.add('body-l');
                taskList.textContent = columnTitle;
                updateColumnList.appendChild(taskList);
            });
        
            const taskContainer = document.querySelector('.current__status .taskColumn__container');

            if(viewTaskChevron.src === "http://127.0.0.1:5500/assets/icon-chevron-down.svg") {
                viewTaskChevron.src = "./assets/icon-chevron-up.svg";
                taskContainer.style.display = 'block';
            } else {
                viewTaskChevron.src = "./assets/icon-chevron-down.svg";
                taskContainer.style.display = 'none';
            }
        });
    }

    const ellipsisTaskBtn = event.target.closest('.ellipsis-task-btn');
    if(ellipsisTaskBtn) {
        ellipsisTaskBtn.addEventListener('click', function() {
            const ellipisisTask = document.querySelector('.ellipsis__task');
            ellipisisTask.classList.toggle('show_task_option');
        })
    }
});
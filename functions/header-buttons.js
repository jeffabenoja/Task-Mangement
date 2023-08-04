const chevron = document.getElementById('chevron');
const taskChevron = document.getElementById('task-chevron');
const headerBtns = document.querySelectorAll('.header-button');
const body = document.body

headerBtns.forEach(function(headerBtn) {
    headerBtn.addEventListener('click', handleClick);
});


function handleClick(e) {
    const btn = e.currentTarget;
    const pressed = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", !pressed);
}

chevron.addEventListener('click', function() {
    if(chevron.src === "http://127.0.0.1:5500/assets/icon-chevron-down.svg") {
        chevron.src = "./assets/icon-chevron-up.svg";
        console.log('working tho');
    } else {
        chevron.src = "./assets/icon-chevron-down.svg";
    }
    const primaryModal = document.querySelector('.primary__modal');
    primaryModal.classList.toggle('primary__modal__show');
})

taskChevron.addEventListener('click', function() {
    const taskContainer = document.querySelector('.taskColumn__container');
    if(taskChevron.src === "http://127.0.0.1:5500/assets/icon-chevron-down.svg") {
        taskChevron.src = "./assets/icon-chevron-up.svg";
        taskContainer.style.display = 'block';
    } else {
        taskChevron.src = "./assets/icon-chevron-down.svg";
        taskContainer.style.display = 'none';
    }
});

window.addEventListener('click', function(e) {
    const primaryModal = document.querySelector('.primary__modal');
    if(e.target === primaryModal) {
        if(chevron.src === "http://127.0.0.1:5500/assets/icon-chevron-up.svg") {
            chevron.src = './assets/icon-chevron-down.svg';
            primaryModal.classList.remove('primary__modal__show');
        }
    }

    const taskContainer = this.document.querySelector('.main_task__modal');
    if(e.target === taskContainer) {
        taskContainer.style.display = 'none';
        const addTaskModal = document.querySelector('.task__modal');
        addTaskModal.style.display = 'none';
    }
})


const taskButton = document.querySelectorAll('.task-btn');
taskButton.forEach(buttons => {
    buttons.addEventListener('click', function(e) {
        e.preventDefault();
        const editTaskStatus = document.querySelector('.task__status button');
        editTaskStatus.style.display = 'block'
        const taskContainer = document.querySelector('.main_task__modal');
        taskContainer.style.display = 'block';
        const addTaskModal = document.querySelector('.task__modal');
        addTaskModal.style.display = 'flex';
        const updateTask = document.querySelector('.viewTask');
        updateTask.style.display = 'none';

        resetTaskModal();

        const inputField = document.querySelectorAll('.task__modal input');
        inputField.forEach(inputs => {
            inputs.classList.remove('empty__inputFields');
        })


        // Reset All the value of input and textarea field
        const taskTitleInput = document.getElementById('task_title');
        const taskDescriptionInput = document.querySelector('.text__area');
        const subtaskFields = document.querySelectorAll('.subtask__field');
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        subtaskFields.forEach(subtask => {
            subtask.value = '';
        })

        const colName = document.getElementById('colName');
        colName.innerText = currentBoard.columns[0].title || currentBoard.columns[0].name;
        

        const subtaskContainer = document.querySelector('.subtask_container')
        const subtaskFieldContainer = subtaskContainer.querySelectorAll('.flex')
        if(subtaskFieldContainer.length < 2 || subtaskFieldContainer.length > 2) {
            subtaskContainer.innerHTML = `
            <div class="flex align-items-center column-gap-3">
                <input
                    class = "subtask__field body-l"
                    type = "text"
                    placeholder = "e.g Make coffee"
                    required
                />
                <img
                    class = "cross-icon"
                    src="./assets/icon-cross.svg" 
                    alt="Delete input column title"
                />
            </div>
            <div class="flex align-items-center column-gap-3">
                <input
                    class = "subtask__field body-l"
                    type = "text"
                    placeholder = "e.g Drink coffee & smile"
                    required
                />
                <img
                    class = "cross-icon"
                    src="./assets/icon-cross.svg" 
                    alt="Delete input column title"
                />
            </div>
            `;
        }
    })
})   

const ellipisisBtn = document.querySelector('.ellipsis-btn');
ellipisisBtn.addEventListener('click', function() {
    const ellipsisDropdown = document.querySelector('.ellipsis__dropdown');
    ellipsisDropdown.classList.toggle('show_ellipsis');
})

const editBoard = document.getElementById('edit_board');
editBoard.addEventListener('click', e => {
    e.stopPropagation();
    const title = document.querySelector('.modal-container h3');
    title.textContent = 'Edit Board';

    const activeBoard = document.querySelector('.active-state .board-name');
    const boardNameInput = document.getElementById('boardName');
    boardNameInput.value = activeBoard.textContent;
    boardNameInput.setAttribute('readonly', 'true');

    
    // Find the board object with the selected board name
    const selectedBoard = boards.find(board => board.name === boardNameInput.value);

    if (selectedBoard) {
        // Get the existing columns of the active board
        const activeBoardColumns = selectedBoard.columns;
    
        // Clear the existing columns in the .modal-column element
        const modalColumn = document.querySelector('.modal-column');
        modalColumn.innerHTML = `
            <p class="body-m clr-primary-400">Columns</p>
        `;
    
        // Add the existing columns to the .modal-column element
        activeBoardColumns.forEach(columnTitle => {
          editNewColumns(columnTitle.title);
        });
    }

    
    createModal.style.display = 'flex';
    const ellipsisDropdown = document.querySelector('.ellipsis__dropdown');
    ellipsisDropdown.classList.remove('show_ellipsis');

});


const editTaskFunction = (selectedTask, selectedColumn) => {
    const taskContainer = document.querySelector('.main_task__modal');
    taskContainer.style.display = 'block';
    const addTaskModal = document.querySelector('.task__modal');
    addTaskModal.style.display = 'flex';
    const updateTask = document.querySelector('.viewTask');
    updateTask.style.display = 'none';

    const title = document.getElementById('add_new_task');
    title.textContent = 'Edit Task';

    
    const taskNameInput = document.getElementById('task_title');
    taskNameInput.value = selectedTask.title;

    const descriptionInput = document.querySelector('.text__area');
    descriptionInput.value = selectedTask.description

    // Set the data-task-title attribute on the task_title input element
    taskNameInput.setAttribute('data-task-title', selectedTask.title);
    
    // Find the task object with the selected board name
    if (selectedTask) {

        // Get the existing columns of the active board
        const activeTask = selectedTask.subtasks;
    
        const subtaskContainer = document.querySelector('.subtask_container');
    
        if(selectedTask.subtasks.length !== 0) {
            subtaskContainer.innerHTML = ``;

            // Add the existing columns to the .modal-column element
            activeTask.forEach(columnTitle => {
                editSubtask(columnTitle.title);
            });
        } else {
            subtaskContainer.innerHTML = `
            <div class="flex align-items-center column-gap-3">
                <input
                    class = "subtask__field body-l"
                    type = "text"
                    placeholder = "e.g Make coffee"
                    required
                />
                <img
                    class = "cross-icon"
                    src="./assets/icon-cross.svg" 
                    alt="Delete input column title"
                />
            </div>
            <div class="flex align-items-center column-gap-3">
                <input
                    class = "subtask__field body-l"
                    type = "text"
                    placeholder = "e.g Drink coffee & smile"
                    required
                />
                <img
                    class = "cross-icon"
                    src="./assets/icon-cross.svg" 
                    alt="Delete input column title"
                />
            </div>
            `;
        }
    }

    const activeColumnName = document.getElementById('colName');
    activeColumnName.innerText = selectedColumn.title || selectedColumn.name;
}

function resetTaskModal () {
    const title = document.getElementById('add_new_task');
    title.textContent = 'Add New Task';

    const subtaskContainer = document.querySelector('.subtask_container')
    subtaskContainer.innerHTML = `
    <div class="flex align-items-center column-gap-3">
        <input
            class = "subtask__field body-l"
            type = "text"
            placeholder = "e.g Make coffee"
            required
        />
        <img
            class = "cross-icon"
            src="./assets/icon-cross.svg" 
            alt="Delete input column title"
        />
    </div>
    <div class="flex align-items-center column-gap-3">
        <input
            class = "subtask__field body-l"
            type = "text"
            placeholder = "e.g Drink coffee & smile"
            required
        />
        <img
            class = "cross-icon"
            src="./assets/icon-cross.svg" 
            alt="Delete input column title"
        />
    </div>
    `;
}

function resetModalContent() {
    const title = document.querySelector('.modal-container h3');
    title.textContent = 'Add New Board';

    const boardName = document.getElementById('boardName');
    boardName.value = '';

    const modalColumn = document.querySelector('.modal-column');
    modalColumn.innerHTML = `
      <p class="body-m clr-primary-400">Columns</p>
      <div class="flex align-items-center column-gap-3">
        <input 
          type="text" 
          class="column-Title modalInput body-l" 
          value="Todo"
          autocomplete="off"
          required
        />
        <div class="cross-icon">
          <img src="./assets/icon-cross.svg" alt="Delete input column title"/>
        </div>
      </div>
      <div class="flex align-items-center column-gap-3">
        <input 
          type="text" 
          class="column-Title modalInput body-l" 
          value="Doing"
          autocomplete="off"
          required
        />
        <div class="cross-icon">
          <img src="./assets/icon-cross.svg" alt="Delete input column title"/>
        </div>
      </div>
    `;
}


// Delete Board Button
const deleteBoard = document.getElementById('delete_board');
deleteBoard.addEventListener('click', function() {
    const selectedBoard = boards.findIndex(board => board.name === boardTitle.textContent);
    if(selectedBoard !== -1) {
        boards.splice(selectedBoard, 1);
        updateLocalStorage();

        // Reload the page after delete the board 
        location.reload();
    }
    const ellipsisDropdown = document.querySelector('.ellipsis__dropdown');
    ellipsisDropdown.classList.remove('show_ellipsis');
})


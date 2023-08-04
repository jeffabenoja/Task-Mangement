// Get the necessary elements
const createBoard = document.querySelectorAll('.create-board');
const createModal = document.querySelector('.modal-container');
const primaryModal = document.querySelector('.primary__modal');
const dropdownBoards = document.querySelector('.dropdown-boards');
const primaryDropdown = document.getElementById('primary__dropdown');
const dropdownRows = document.querySelectorAll('.dropdown-row');
const boardTitle = document.querySelector('.board-title');

// Fetch the data from data.json
fetch('data.json')
  .then(response => response.json())
  .then(jsonData => {
    // Check if the data is already stored in localStorage
    if (!localStorage.getItem('boards')) {
      // Store the JSON data in localStorage
      localStorage.setItem('boards', JSON.stringify(jsonData.boards));
    }
  })
  .catch(error => {
    console.error('Error fetching or storing data:', error);
  });


// Retrieve boards from local storage
let boards = JSON.parse(localStorage.getItem('boards')) || [];

// Function to update local storage with the current boards
const updateLocalStorage = () => {
  localStorage.setItem('boards', JSON.stringify(boards));
};

// Handle add column button click
const addColumnBtn = document.getElementById('addColumn-btn');
addColumnBtn.addEventListener('click', function() {
  createNewColumn();
});

const addSubtaskBtn = document.getElementById('addSubtask-btn');
addSubtaskBtn.addEventListener('click', function() {
  createSubtask();
})

// Function to create a new column
const createNewColumn = () => {
  const columnTitleInput = document.createElement('input');
  columnTitleInput.type = 'text';
  columnTitleInput.classList.add('column-Title');
  columnTitleInput.classList.add('modalInput');
  columnTitleInput.classList.add('body-l');

  const crossIconDiv = document.createElement('div');
  crossIconDiv.classList.add('cross-icon');
  crossIconDiv.innerHTML = '<img src="./assets/icon-cross.svg" alt="Delete input column title"/>';

  const columnDiv = document.createElement('div');
  columnDiv.classList.add('flex');
  columnDiv.classList.add('align-items-center');
  columnDiv.classList.add('column-gap-3');
  columnDiv.appendChild(columnTitleInput);
  columnDiv.appendChild(crossIconDiv);

  const modalColumn = document.querySelector('.modal-column');
  // modalColumn.insertBefore(columnDiv, addColumnBtn);
  modalColumn.appendChild(columnDiv);
};

// Function to edit column
const editNewColumns = (columnTitle = '') => {
  const columnTitleInput = document.createElement('input');
  columnTitleInput.type = 'text';
  columnTitleInput.classList.add('column-Title');
  columnTitleInput.classList.add('modalInput');
  columnTitleInput.classList.add('body-l');
  columnTitleInput.value = columnTitle;

  const crossIconDiv = document.createElement('div');
  crossIconDiv.classList.add('cross-icon');
  crossIconDiv.innerHTML = '<img src="./assets/icon-cross.svg" alt="Delete input column title"/>';

  const columnDiv = document.createElement('div');
  columnDiv.classList.add('flex');
  columnDiv.classList.add('align-items-center');
  columnDiv.classList.add('column-gap-3');
  columnDiv.appendChild(columnTitleInput);
  columnDiv.appendChild(crossIconDiv);

  const modalColumn = document.querySelector('.modal-column');
  modalColumn.appendChild(columnDiv);
};

const createSubtask = () => {
  const subtaskContainer = document.querySelector('.subtask_container')

  const subtaskField = document.createElement('div');
  subtaskField.classList.add('flex');
  subtaskField.classList.add('align-items-center');
  subtaskField.classList.add('column-gap-3');
  subtaskField.innerHTML = `
    <input
      class = "subtask__field body-l"
      type = "text"
      autocomplete = "off"
      required
    />
    <img
      class = "cross-icon"
      src="./assets/icon-cross.svg" 
      alt="Delete input column title"
    />
  `;

  subtaskContainer.appendChild(subtaskField);
}

const editSubtask = (columnTitle = '') => {
  const subtaskContainer = document.querySelector('.subtask_container')

  const subtaskField = document.createElement('div');
  subtaskField.classList.add('flex');
  subtaskField.classList.add('align-items-center');
  subtaskField.classList.add('column-gap-3');

  const subtaskInput = document.createElement('input');
  subtaskInput.type = 'text';
  subtaskInput.classList.add('subtask__field', 'body-l');
  subtaskInput.setAttribute('autocomplete', 'off')
  subtaskInput.value = columnTitle;

  const crossIconDiv = document.createElement('div');
  crossIconDiv.classList.add('cross-icon');
  crossIconDiv.innerHTML = '<img src="./assets/icon-cross.svg" alt="Delete input column title"/>';
  subtaskField.appendChild(subtaskInput);
  subtaskField.appendChild(crossIconDiv);


  subtaskContainer.appendChild(subtaskField);
}

// Handle create board button click
createBoard.forEach(board => {
  board.addEventListener('click', function(event) {
    event.stopPropagation();
    resetModalContent();
    createModal.style.display = 'flex';

    const primaryModal = document.querySelector('.primary__modal');
    primaryModal.classList.remove('primary__modal__show');
    if(chevron.src.includes("icon-chevron-up.svg")) {
      chevron.src = "./assets/icon-chevron-down.svg";
    }

    const inputField = document.querySelectorAll('#modal-createBoard input');
    inputField.forEach(inputs => {
      inputs.classList.remove('empty__inputFields');
    })
  });
});


// Handle outside click to close the modal
window.addEventListener('click', function(event) {
  if (event.target === createModal) {
    createModal.style.display = 'none';
  }
});

// Handle create button click to add a new board
const createBtn = document.getElementById('create-btn');
createBtn.addEventListener('click', function() {
  const boardNameInput = document.getElementById('boardName');
  boardNameInput.removeAttribute('readonly');
  const boardName = boardNameInput.value.trim();
  const inputField = document.querySelectorAll('#modal-createBoard input');

  if (boardName !== '') {
    createNewBoard(boardName);
  } else {
    inputField.forEach(inputs => {
      if(inputs.value === '') {
        inputs.classList.toggle('empty__inputFields');
      }
    })
  }
});

// Function to remove the 'empty__inputFields' class
const removeEmptyInputFieldClass = function() {
  // Check if the input field has the 'empty__inputFields' class
  if (this.classList.contains('empty__inputFields')) {
    // If it has the class, remove it
    this.classList.remove('empty__inputFields');
  }
};

const inputField = document.querySelectorAll('.modal-container input');
inputField.forEach(inputs => {
  inputs.addEventListener('click', removeEmptyInputFieldClass);
  inputs.addEventListener('keydown', removeEmptyInputFieldClass)
})

// Remove the empty__inputfield class when user click the input field
const inputFields = document.querySelectorAll('.task__modal input');
inputFields.forEach(inputs => {
  inputs.addEventListener('click', removeEmptyInputFieldClass);
  inputs.addEventListener('keydown', removeEmptyInputFieldClass)
})

const modalColumn = document.querySelector('.modal-column');
modalColumn.addEventListener('click', function(event) {
    if (event.target.matches('.cross-icon, .cross-icon img')) {
        const columnDiv = event.target.closest('.flex');
        modalColumn.removeChild(columnDiv);
    }
});

const subtaskContainer = document.querySelector('.subtask_container');
subtaskContainer.addEventListener('click', e => {
  if(e.target.matches('.cross-icon')) {
    const subtaskDiv = e.target.closest('.flex');
    subtaskDiv.remove();
  }
})


const boardContainer = document.querySelector('.board');
let currentBoard = null; // To keep track of the currently selected board

// Function to render a board in the dropdown
const renderBoard = (board) => {
  const newBoard = document.createElement('div');
  newBoard.classList.add('dropdown-row');
  newBoard.innerHTML = `
    <img src="./assets/icon-board.svg" alt="Board icon"/>
    <h4 class="board-name">${board.name}</h4>
  `;

  primaryDropdown.appendChild(newBoard); // Append the newBoard to primaryDropdown

  const clonedBoard = newBoard.cloneNode(true); // Clone the newBoard element
  dropdownBoards.appendChild(clonedBoard); // Append the clonedBoard to dropdownBoards

  const dropdown = primaryDropdown.querySelectorAll('.dropdown-row');

  const totalBoards = document.querySelectorAll('.totalBoards');
  totalBoards.forEach(numOfBoards => {
    numOfBoards.textContent = dropdown.length;
  });

  if (dropdown.length === 0) {
    const taskBtns = document.querySelectorAll('.task-btn');
    taskBtns.forEach(taskBtn => {
      taskBtn.style.backgroundColor = 'rgb(168, 164, 255)';
    });
  }
};

// Function to generate a random color in hexadecimal format
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const generatedColors = ["#49C4E5", "#8471F2", "#67E2AE"];

const renderColumns = (board) => {
  const columnContainer = document.createElement('div');
  columnContainer.classList.add('column-container');
  columnContainer.classList.add('flex')

  board.columns.forEach((column, index) => {
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('column');

    const backgroundColor = generatedColors[index] || generateRandomColor();
    generatedColors.push(backgroundColor); // Store the color in the array

    const columnTitle = column.title;
    columnDiv.innerHTML = `
      <div class="column__title heading-S clr-primary-400" style="--random-color: ${backgroundColor}">
        ${columnTitle || column.name}
        (
          <span id="count__task">${column.tasks ? column.tasks.length : 0}</span>
        )
      </div>
    `;

    // Render task cards
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('card__container');
    column.tasks.forEach((task, cardIndex) => {
      const taskCard = document.createElement('div');

      taskCard.dataset.columnId = index; // Set a unique identifier for the column
      taskCard.dataset.cardId = cardIndex; // Set a unique identifier for the card

      taskCard.classList.add('card');
      taskCard.innerHTML = `
        <h3 class="card__title heading-M">${task.title}</h3>
        <div class="subtask__count body-m clr-primary-400">
          <span class="subtask_done" data-column-id="${index}" data-card-id="${cardIndex}">${task.subtasks.filter(subtask => subtask.done).length}</span>
          of
          <span class="subtask_length">${task.subtasks.length}</span>
          Subtasks
        </div>
      `;
      taskContainer.appendChild(taskCard);
    });

    columnDiv.appendChild(taskContainer);
    columnContainer.appendChild(columnDiv);
  });

  // Clear the existing columns before adding new ones
  boardContainer.innerHTML = '';
  boardContainer.appendChild(columnContainer);

  // Attach click event listeners to the cards
  attachCardClickListeners();
};

let activeBoardIndex = 0; 

const handleDropdownClick = (index, dropdownRows) => {
  // Toggle active-state class for the clicked dropdown and remove it from others
  dropdownRows.forEach((row, i) => {
    row.classList.toggle('active-state', i === index);
  });

  // Update the activeBoardIndex
  activeBoardIndex = index;

  // Get the board name of the clicked dropdown
  const selectedBoardName = dropdownRows[index].querySelector('.board-name').textContent;

  //Update the boardTitle with the text of the clicked dropdown
  boardTitle.textContent = dropdownRows[index].querySelector('.board-name').textContent;

  // Find the board object with the selected board name
  const selectedBoard = boards.find(board => board.name === selectedBoardName);

  if (selectedBoard) {
    // Update the current board with the selected board
    currentBoard = selectedBoard;

    // Render the columns for the selected board
    renderColumns(currentBoard);

    // Render the task column list for the selected board
    renderTaskColumnList(currentBoard);
  }
};

const initApp = () => {
  // Clear the boardContainer before rendering the columns
  boardContainer.innerHTML = '';

  // Render existing boards from local storage
  boards.forEach((board) => {
    renderBoard(board);
  });

  // Get all dropdown rows (both existing and new ones)
  const allDropdownRows = document.querySelectorAll('.dropdown-row');

  // Set the active state for the first dropdown
  if (allDropdownRows.length > 0) {
    // allDropdownRows[0].classList.add('active-state');

    // Get the board name of the first dropdown
    const selectedBoardName = allDropdownRows[0].querySelector('.board-name').textContent;

    // Get the board name and store it in board title when page reload
    boardTitle.textContent = allDropdownRows[0].querySelector('.board-name').textContent;

    // Find the board object with the selected board name
    const selectedBoard = boards.find(board => board.name === selectedBoardName);

    if (selectedBoard) {
      // Set the current board to the first board
      currentBoard = selectedBoard;

      // Render the columns for the first board
      renderColumns(currentBoard);

      // Render task column list for the selected board
      renderTaskColumnList(currentBoard);
    }
  }

  //Get all dropdown rows in dropdownBoards
  const dropdownRowsInDropdownBoards = document.querySelectorAll('.dropdown-boards .dropdown-row');

  // Set the active state for the first dropdown in dropdownBoards
  if (dropdownRowsInDropdownBoards.length > 0) {
    dropdownRowsInDropdownBoards[0].classList.add('active-state');
  }

  // Add click event listeners to all dropdown rows
  allDropdownRows.forEach((dropdown, index) => {
    dropdown.addEventListener('click', () => {
      handleDropdownClick(index, allDropdownRows);
      // saveActiveDropdownIndex(index);
    });
  });
};

const createNewBoard = (boardName) => {
  // Check if a board with the same name already exists
  const existingBoard = boards.find(board => board.name === boardName);

  if (existingBoard) {
    // If the board with the same name already exists, update its columns
    const columnTitleInputs = document.querySelectorAll(".column-Title");

    // Reset the column of existing board
    existingBoard.columns = [];

    columnTitleInputs.forEach(input => {
      const columnTitle = input.value.trim();
      // Verify if empty
      if (columnTitle !== '') {
        updateBoardColumns(existingBoard, columnTitle);
      }
    });

    // Update local storage
    updateLocalStorage();

    // Set the currentBoard to the existing board
    setCurrentBoard(existingBoard);

    // Update the task column list for the existing board
    renderTaskColumnList(existingBoard);

    // Clear the taskColumn_list before appending new columns
    const taskColumn_list = document.querySelector('.taskColumn_list');
    taskColumn_list.innerHTML = '';

    // Loop through the columns of the current board and append their titles to the taskColumn_list
    existingBoard.columns.forEach((column) => {
      const columnTitle = column.title;
      const taskList = document.createElement('li');
      taskList.classList.add('body-l');
      taskList.textContent = columnTitle;
      taskColumn_list.appendChild(taskList);
    });

    // Hide the modals after creating a new board
    createModal.style.display = 'none';
    primaryModal.style.display = 'none';

    // Render the existing board in the dropdown
    const allDropdownRows = document.querySelectorAll('.dropdown-row');
    handleDropdownClick(activeBoardIndex, allDropdownRows);
  } else {
    // If a board with the same name does not exist, create a new board

    // Create a new board object
    const newBoard = {
      name: boardName,
      columns: [], // Default columns
    };

    // Add the new board to the boards array
    boards.push(newBoard);

    // Update local storage
    updateLocalStorage();

    // Render the new board in the dropdown
    renderBoard(newBoard);

    // Clear the board name input
    const boardNameInput = document.getElementById('boardName');
    boardNameInput.value = '';

    // Update the boardTitle with the text of the newly created dropdown
    boardTitle.textContent = newBoard.name;

    // Add the new column to the newBoard object
    const columnTitleInputs = document.querySelectorAll(".column-Title");

    columnTitleInputs.forEach(input => {
      const columnTitle = input.value.trim();
      // Verify if empty
      if (columnTitle !== '') {
        updateBoardColumns(newBoard, columnTitle);
      }
    });

    // Hide the modals after creating a new board
    createModal.style.display = 'none';
    primaryModal.style.display = 'none';

    // Render the Column
    renderColumns(newBoard);

    // Set the currentBoard to the newly created board
    setCurrentBoard(newBoard);

    // Update the task column list for the newly created board
    renderTaskColumnList(newBoard);

    // Clear the taskColumn_list before appending new columns
    const taskColumn_list = document.querySelector('.taskColumn_list');
    taskColumn_list.innerHTML = '';

    // Loop through the columns of the current board and append their titles to the taskColumn_list
    newBoard.columns.forEach((column) => {
      const columnTitle = column.title;
      const taskList = document.createElement('li');
      taskList.classList.add('body-l');
      taskList.textContent = columnTitle;
      taskColumn_list.appendChild(taskList);
    });

    // Get all dropdown rows (both existing and new ones) including the newly created one
    const allDropdownRows = document.querySelectorAll('.dropdown-row');

    // Add active-state to newly create one
    allDropdownRows.forEach((dropdown, index) => {
      if (index === allDropdownRows.length - 1) {
        dropdown.classList.add('active-state');
      } else {
        dropdown.classList.remove('active-state');
      }
    });

    // Add click event listeners to all dropdown rows (including the newly created one)
    allDropdownRows.forEach((dropdown, index) => {
      dropdown.addEventListener('click', () => {
        handleDropdownClick(index, allDropdownRows);
        //saveActiveDropdownIndex(index);
      });
    });
  }
};

// Call the initApp function to start the application
initApp();



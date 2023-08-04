
// const themeToggleCheckbox = document.querySelectorAll('.themeToggleCheckbox');

// themeToggleCheckbox.forEach(toggle => {
//   toggle.addEventListener('click', function() {
//     const appContainer = document.getElementById('app');
//     if (this.checked) {
//       appContainer.classList.add('dark');
//     } else {
//       appContainer.classList.remove('dark');
//     }
//   });
// })

//sidebar
const titleContainer = document.querySelector('.title-container');

// SideBar 
const sidebar = document.getElementById('aside');

// Hide sidebar
const hideSidebar = () => {
  boardContainer.classList.remove('open-sidebar');
  boardContainer.classList.add('close-sidebar');
  sidebar.setAttribute('data-type', 'visually-hidden');
  // sidebar.style.marginLeft = '-300px';
  showBtn.removeAttribute('data-type');
};

// Show sidebar
const showSidebar = () => {
  boardContainer.classList.add('open-sidebar');
  boardContainer.classList.remove('close-sidebar');
  showBtn.setAttribute('data-type', 'visually-hidden');
  sidebar.removeAttribute('data-type');
};

// Handle hide sidebar button click
const hideBtn = document.querySelector('.hide-sidebar');
hideBtn.addEventListener('click', () => {
  hideSidebar();
});

// Handle show sidebar button click
const showBtn = document.querySelector('#show-sidebar');
showBtn.addEventListener('click', () => {
  showSidebar();
});
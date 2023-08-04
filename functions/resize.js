const resizeSidebar = document.getElementById('aside')


function handleResize() {
    const width = window.innerWidth;
    if (width >= 768) {
        resizeSidebar.removeAttribute('data-type');
    }
}

// Call handleResize initially
handleResize();

// Add event listener for window resize
window.addEventListener('resize', handleResize);


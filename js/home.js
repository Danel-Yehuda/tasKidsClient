$(document).ready(function() {
    // Log out button functionality
    $('.btn-outline-danger').on('click', function() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
});

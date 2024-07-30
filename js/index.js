$(document).ready(function() {
    if (sessionStorage.getItem('user')) {
        window.location.href = 'home.html';
    }

    $('#logo').on('click', function() {
        $('#signin-section, #signup-section').hide();
        $('#kids-signin-section').show();
    });

    $('#show-signup').on('click', function(event) {
        event.preventDefault();
        $('#signin-section').hide();
        $('#signup-section').show();
    });

    $('#show-signin').on('click', function(event) {
        event.preventDefault();
        $('#signup-section').hide();
        $('#signin-section').show();
    });

    $('#signup-form').on('submit', function(event) {
        event.preventDefault();

        const userData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            password: $('#password').val()
        };

        fetch('https://taskidserver.onrender.com/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                $('#signup-error').text(data.message).show();
            } else {
                sessionStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $('#signup-error').text('An error occurred during sign up.').show();
        });
    });

    $('#signin-form').on('submit', function(event) {
        event.preventDefault();

        const loginData = {
            email: $('#signin-email').val(),
            password: $('#signin-password').val()
        };

        fetch('https://taskidserver.onrender.com/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                $('#signin-error').text(data.message).show();
            } else {
                sessionStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $('#signin-error').text('An error occurred during sign in.').show();
        });
    });

    $('#kids-signin-form').on('submit', function(event) {
        event.preventDefault();

        const kidLoginData = {
            parent_email: $('#parent-email').val(),
            kid_password: $('#kid-password').val()
        };

        fetch('https://taskidserver.onrender.com/api/kids/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(kidLoginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                $('#kids-signin-error').text(data.message).show();
            } else {
                sessionStorage.setItem('kid', JSON.stringify(data));
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            $('#kids-signin-error').text('An error occurred during kid sign in.').show();
        });
    });
});

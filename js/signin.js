$(document).ready(function() {

    // Check if user exists in local storage
    if (localStorage.getItem('user')) {
        window.location.href = 'home.html';
    }

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

        $.ajax({
            url: 'http://localhost:8080/api/users/signup',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                console.log(response);
                localStorage.setItem('user', JSON.stringify(response));
                window.location.href = 'home.html';
            },
            error: function(error) {
                $('#signup-error').text(error.responseJSON.message).show();
            }
        });
    });

    $('#signin-form').on('submit', function(event) {
        event.preventDefault();

        const loginData = {
            email: $('#signin-email').val(),
            password: $('#signin-password').val()
        };

        $.ajax({
            url: 'http://localhost:8080/api/users/signin',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(loginData),
            success: function(response) {
                console.log(response);
                localStorage.setItem('user', JSON.stringify(response));
                window.location.href = 'home.html';
            },
            error: function(error) {
                $('#signin-error').text(error.responseJSON.message).show();
            }
        });
    });
});

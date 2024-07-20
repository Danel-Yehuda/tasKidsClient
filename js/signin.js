$(document).ready(function() {
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
                alert('Sign Up successful');
                $('#signup-section').hide();
                $('#signin-section').show();
            },
            error: function(error) {
                alert('Error during Sign Up');
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
                alert('Sign In successful');
            },
            error: function(error) {
                alert('Error during Sign In');
            }
        });
    });
});

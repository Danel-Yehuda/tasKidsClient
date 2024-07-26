$(document).ready(function() {

    if (sessionStorage.getItem('user')) {
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

        fetch('http://localhost:8080/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Handle error response
                document.getElementById('signup-error').textContent = data.message;
                document.getElementById('signup-error').style.display = 'block';
            } else {
                // Handle success response
                console.log(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            // Handle network or other errors
            console.error('Error:', error);
            document.getElementById('signup-error').textContent = 'An error occurred during sign up.';
            document.getElementById('signup-error').style.display = 'block';
        });
    });

    $('#signin-form').on('submit', function(event) {
        event.preventDefault();

        const loginData = {
            email: $('#signin-email').val(),
            password: $('#signin-password').val()
        };

        fetch('http://localhost:8080/api/users/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Handle error response
                document.getElementById('signin-error').textContent = data.message;
                document.getElementById('signin-error').style.display = 'block';
            } else {
                // Handle success response
                console.log(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                window.location.href = 'home.html';
            }
        })
        .catch(error => {
            // Handle network or other errors
            console.error('Error:', error);
            document.getElementById('signin-error').textContent = 'An error occurred during sign in.';
            document.getElementById('signin-error').style.display = 'block';
        });
    });
});

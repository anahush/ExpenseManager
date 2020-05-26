function toSignUp() {
    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function toSignIn() {
    var loginForm = document.querySelector('#login-form');
    var registerForm = document.querySelector('#register-form');
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
}
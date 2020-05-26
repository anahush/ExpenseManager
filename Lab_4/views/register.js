let Register = {
    render: async () => {
        return `
        <main class="login">
            <div class="login-page">
                <div class="form-login">
                <form class="register-form" id="register-form">
                    <input type="text" id="loginRegister" placeholder="name" />
                    <input type="password" id="passwordRegister" placeholder="password" />
                    <input type="text" id="emailRegister" placeholder="email address" />
                    <button class="register" id="registerBtn">create</button>
                    <p class="message">Already registered? <a href="#/login">Sign In</a></p>
                </form>
                </div>
            </div>
        </main>
        `
    },

    afterRender: async () => {
        window.location.hash = '/register';
        const formCreate = document.querySelector('#register-form');
        let isSuccessfull = true;

        formCreate.addEventListener('submit', e => {
            e.preventDefault();
            const username = formCreate['loginRegister'].value;
            const password = formCreate['passwordRegister'].value;
            const email = formCreate['emailRegister'].value;

            if (email == '' | password == '' | username == '') {
                alert('Fields cannot be left blank');
            } else {
                const promiseAuth = auth.createUserWithEmailAndPassword(email, password);
                promiseAuth.catch(e => {
                    alert(e.message);
                    isSuccessfull = false;
                });
            }

            if (isSuccessfull) {
                auth.onAuthStateChanged(firebaseUser => {
                    if (firebaseUser) {
                        alert(`User ${username} was successfully registered.`);
                        window.location.hash = '/';
                        db.ref('users/' + firebaseUser.uid).set({
                            username: username,
                            email: email
                        }).catch(e => {
                            alert(e.message);
                        });
                    }
                })                
            }
        });
    }
};

export default Register;
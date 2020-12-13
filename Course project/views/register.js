import DatabaseUtils from "../services/databaseUtils.js";

let Register = {
    render: async () => {
        return `
        <main class="login">
            <div class="login-page">
                <div class="form-login">
                <form class="register-form" id="register-form">
                    <input type="text" id="loginRegister" placeholder="name" required/>
                    <input type="password" id="passwordRegister" placeholder="password" required/>
                    <input type="email" id="emailRegister" placeholder="email address" required/>
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
                const promiseAuth = auth.createUserWithEmailAndPassword(email, password).catch(e => {
                    alert(e.message);
                    isSuccessfull = false;
                }).then(() => {
                    if (isSuccessfull) {
                        auth.onAuthStateChanged(firebaseUser => {
                            if (firebaseUser) {
                                alert(`User ${username} was successfully registered.`);
                                window.location.hash = '/';
                                DatabaseUtils.getKey("loginUserInfo/", null).then((key) => {
                                    db.ref('loginUserInfo/' + key).set({
                                        username: username,
                                        email: email,
                                        uid: firebaseUser.uid,
                                        role: "user",
                                        status: "active",
                                    }).catch(e => {
                                        alert(e.message);
                                    });
                                })
                            }
                        })                
                    }
                })
            }
        });
    }
};

export default Register;
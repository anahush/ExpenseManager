let Login = {
    render: async() => {
        return `
        <main class="login">
            <div class="login-page">
                <div class="form-login">
                    <form class="login-form" id="login-form">
                        <input type="text" id="emailLogin" placeholder="email" />
                        <input type="password" id="passwordLogin" placeholder="password" />
                        <button>login</button>
                        <p class="message">Not registered? <a href="#/register">Create an account</a></p>
                    </form>
                </div>
            </div>
        </main>
        `
    },

    afterRender: async () => {
        const formLogin = document.querySelector('#login-form');
        let isSuccessfull = true;

        formLogin.addEventListener('submit', e => {
            e.preventDefault();
            const email = formLogin['emailLogin'].value;
            const password = formLogin['passwordLogin'].value;
            auth.signInWithEmailAndPassword(email, password).then(() => {
                auth.onAuthStateChanged(firebaseUser => {
                    if (firebaseUser){
                        alert("Signed in successfully.");
                        window.location.hash = '/';
                    }
                });
            }).catch(e => {
                alert(e.message);
            })
        })
    }
};

export default Login;
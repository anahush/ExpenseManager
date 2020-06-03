let Navbar = {
    render: async () => {
        return `
        <header class="nav-wrapper" id="myTopnav">
            <nav>
                <ul class="nav-ul">
                    <li><button class="icon" onclick="hamburgerOpenClose()"><img src="res/ham_menu.png"></button></li>
                    <li class="home-link"><a href="#/" class="first"><img class="home" src="res/home.png" />Home</a></li>
                    <li><a href="#/transactions">Transactions</a></li>
                    <li><a href="#/plans">Plans</a></li>
                    <li><a href="#/goals">Goals</a></li>
                    <li class="longer-text"><a class="l-t" href="#/statistics">Full statistics</a></li>
                    <div class="float-right">
                        ${Navbar.renderButton()}
                    </div>
                </ul>
            </nav>
        </header>
        `
    },

    renderOnlyLogin: async () => {
        return `
        <header class="nav-wrapper" id="myTopnav">
            <nav>
                <ul class="nav-ul">
                    <li><button class="icon" onclick="hamburgerOpenClose()"><img src="res/ham_menu.png"></button></li>
                    <li class="home-link"><a href="#/login" class="first" style="width: 70px;"><img class="home" src="res/home.png" />Home</a></li>
                    <div class="float-right">
                        ${Navbar.renderButton()}
                    </div>
                </ul>
            </nav>
        </header>
        `
    } ,

    renderButton: () => {
        if (auth.currentUser) {
            return Navbar.renderSignOutButton();
        } else {
            return Navbar.renderSignInButton();
        }
    },

    renderSignInButton: () => {
        return `
        <li class='nav-button'><a class="sign-in-button" id="sign-in" href="#/login">Sign in/up</a></li>
        `
    },

    renderSignOutButton: () => {
        return `
        <li class='nav-button'><a class="sign-out-button" id="sign-out" href="#/">Sign out</a></li>
        `
    },

    afterRender: async () => {
        const btnLogOut = document.getElementById('sign-out');

        if (btnLogOut) {
            btnLogOut.addEventListener('click', () => {
                auth.signOut();
            })
        }
    }
}

export default Navbar;
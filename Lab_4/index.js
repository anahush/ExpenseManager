import AddGoal from './views/add_goal.js';
import AddPlan from './views/add_plan.js';
import AddTransaction from './views/add_transaction.js';
import Goals from './views/goals.js';
import Login from './views/login.js';
import MainPage from './views/mainpage.js';
import Plans from './views/plans.js';
import Register from './views/register.js';
import Statistics from './views/statistics.js';
import Transactions from './views/transactions.js';
import Error404 from './views/error404.js';

import Utils from './services/utils.js';
import Navbar from './views/navbar.js';

const routes = {
    '/': MainPage,
    '/add_goal': AddGoal,
    '/add_plan': AddPlan,
    '/add_transaction': AddTransaction,
    '/goals': Goals,
    '/login': Login,
    '/plans': Plans,
    '/statistics': Statistics,
    '/transactions': Transactions,
    '/register': Register
};

const router = async() => {
    const all = [];

    const header = null || document.querySelector('header');
    const content = null || document.querySelector('div.site-content');

    let request = Utils.parseRequestURL();
    let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '');
    let page = routes[parsedURL] ? routes[parsedURL] : Error404;

    header.innerHTML = await Navbar.render();
    await Navbar.afterRender();

    content.innerHTML = await page.render();
    await page.afterRender();
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    router();
})
auth.onAuthStateChanged(firebaseUser => {
    if (window.location.hash == "#/" && !firebaseUser) {
        router();
    }
})
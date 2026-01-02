import Admin from './pages/Admin';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Results from './pages/Results';
import Test from './pages/Test';
import Sessions from './pages/Sessions';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Home": Home,
    "Payment": Payment,
    "Results": Results,
    "Test": Test,
    "Sessions": Sessions,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
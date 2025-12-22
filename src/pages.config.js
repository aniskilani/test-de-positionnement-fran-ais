import Admin from './pages/Admin';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Results from './pages/Results';
import Test from './pages/Test';


export const PAGES = {
    "Admin": Admin,
    "Home": Home,
    "Payment": Payment,
    "Results": Results,
    "Test": Test,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
};
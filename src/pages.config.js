import Admin from './pages/Admin';
import Home from './pages/Home';
import Payment from './pages/Payment';
import Results from './pages/Results';
import Sessions from './pages/Sessions';
import Test from './pages/Test';
import TrainerAccess from './pages/TrainerAccess';
import Privacy from './pages/Privacy';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Home": Home,
    "Payment": Payment,
    "Results": Results,
    "Sessions": Sessions,
    "Test": Test,
    "TrainerAccess": TrainerAccess,
    "Privacy": Privacy,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
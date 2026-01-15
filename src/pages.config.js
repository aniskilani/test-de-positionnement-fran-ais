import Admin from './pages/Admin';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import LegalNotice from './pages/LegalNotice';
import MyAccount from './pages/MyAccount';
import Payment from './pages/Payment';
import Privacy from './pages/Privacy';
import Results from './pages/Results';
import Sessions from './pages/Sessions';
import Terms from './pages/Terms';
import Test from './pages/Test';
import TrainerAccess from './pages/TrainerAccess';
import Formations from './pages/Formations';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Contact": Contact,
    "FAQ": FAQ,
    "Home": Home,
    "LegalNotice": LegalNotice,
    "MyAccount": MyAccount,
    "Payment": Payment,
    "Privacy": Privacy,
    "Results": Results,
    "Sessions": Sessions,
    "Terms": Terms,
    "Test": Test,
    "TrainerAccess": TrainerAccess,
    "Formations": Formations,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
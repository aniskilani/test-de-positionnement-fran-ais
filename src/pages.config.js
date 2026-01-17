import Admin from './pages/Admin';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Formations from './pages/Formations';
import Home from './pages/Home';
import LegalNotice from './pages/LegalNotice';
import MyAccount from './pages/MyAccount';
import Payment from './pages/Payment';
import Privacy from './pages/Privacy';
import Results from './pages/Results';
import Sessions from './pages/Sessions';
import Terms from './pages/Terms';
import Test from './pages/Test';
import TestEmail from './pages/TestEmail';
import TrainerAccess from './pages/TrainerAccess';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Contact": Contact,
    "FAQ": FAQ,
    "Formations": Formations,
    "Home": Home,
    "LegalNotice": LegalNotice,
    "MyAccount": MyAccount,
    "Payment": Payment,
    "Privacy": Privacy,
    "Results": Results,
    "Sessions": Sessions,
    "Terms": Terms,
    "Test": Test,
    "TestEmail": TestEmail,
    "TrainerAccess": TrainerAccess,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
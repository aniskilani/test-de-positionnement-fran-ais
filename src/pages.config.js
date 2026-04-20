/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
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
import PrintTest from './pages/PrintTest';
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
    "PrintTest": PrintTest,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
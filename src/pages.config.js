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
import Assessment from './pages/Assessment';
import AutomationTesterExams from './pages/AutomationTesterExams';
import CreateAnnouncement from './pages/CreateAnnouncement';
import EntranceExams from './pages/EntranceExams';
import GitGithub from './pages/GitGithub';
import GitGithubSetup from './pages/GitGithubSetup';
import Home from './pages/Home';
import Join from './pages/Join';
import ManageContent from './pages/ManageContent';
import ManualTesterExams from './pages/ManualTesterExams';
import NoticeBoard from './pages/NoticeBoard';
import Projects from './pages/Projects';
import SQLMeetings from './pages/SQLMeetings';
import Setup from './pages/Setup';
import SubmitContent from './pages/SubmitContent';
import Tools from './pages/Tools';
import PlaywrightForManualTesters from './pages/PlaywrightForManualTesters';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Admin": Admin,
    "Assessment": Assessment,
    "AutomationTesterExams": AutomationTesterExams,
    "CreateAnnouncement": CreateAnnouncement,
    "EntranceExams": EntranceExams,
    "GitGithub": GitGithub,
    "GitGithubSetup": GitGithubSetup,
    "Home": Home,
    "Join": Join,
    "ManageContent": ManageContent,
    "ManualTesterExams": ManualTesterExams,
    "NoticeBoard": NoticeBoard,
    "Projects": Projects,
    "SQLMeetings": SQLMeetings,
    "Setup": Setup,
    "SubmitContent": SubmitContent,
    "Tools": Tools,
    "PlaywrightForManualTesters": PlaywrightForManualTesters,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
import Home from './pages/Home';
import Projects from './pages/Projects';
import Tools from './pages/Tools';
import Join from './pages/Join';
import Assessment from './pages/Assessment';
import EntranceExams from './pages/EntranceExams';
import ManualTesterExams from './pages/ManualTesterExams';
import AutomationTesterExams from './pages/AutomationTesterExams';
import Admin from './pages/Admin';
import Setup from './pages/Setup';
import SubmitContent from './pages/SubmitContent';
import ManageContent from './pages/ManageContent';
import GitGithub from './pages/GitGithub';
import GitGithubSetup from './pages/GitGithubSetup';
import NoticeBoard from './pages/NoticeBoard';
import CreateAnnouncement from './pages/CreateAnnouncement';
import SQLMeetings from './pages/SQLMeetings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Projects": Projects,
    "Tools": Tools,
    "Join": Join,
    "Assessment": Assessment,
    "EntranceExams": EntranceExams,
    "ManualTesterExams": ManualTesterExams,
    "AutomationTesterExams": AutomationTesterExams,
    "Admin": Admin,
    "Setup": Setup,
    "SubmitContent": SubmitContent,
    "ManageContent": ManageContent,
    "GitGithub": GitGithub,
    "GitGithubSetup": GitGithubSetup,
    "NoticeBoard": NoticeBoard,
    "CreateAnnouncement": CreateAnnouncement,
    "SQLMeetings": SQLMeetings,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};
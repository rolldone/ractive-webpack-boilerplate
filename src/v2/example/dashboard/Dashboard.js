import Layout from "../Layout";
import template from './views/DashboardView.html';
import BaseRactive from "BaseRactive";
import SideMenu from './parent/SideMenu';

export const Dashboard = BaseRactive.extend({
    template,
    oncomplete : function(){

    }
})
export default Layout({
    BodyContent : Dashboard,
    SideMenu
})
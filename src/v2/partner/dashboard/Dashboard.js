import Layout from "../Layout";
import template from './views/DashboardView.html';
import BaseRactive from "BaseRactive";

export const Dashboard = BaseRactive.extend({
    template,
    oncomplete : function(){

    }
})
export default Layout({
    BodyContent : Dashboard,
})
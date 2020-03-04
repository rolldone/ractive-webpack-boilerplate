import Layout from "../Layout";
import { Orders } from "./Orders";

export const OrdersSelf = Orders.extend({})

export default Layout({
  BodyContent : OrdersSelf
})
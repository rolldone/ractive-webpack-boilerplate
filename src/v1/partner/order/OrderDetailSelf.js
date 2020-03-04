import Layout from "../Layout";
import { OrderDetail } from "./OrderDetail";

export const OrderDetailSelf = OrderDetail.extend({})

export default Layout({
  BodyContent : OrderDetailSelf
})

module.exports = {

    transform_Uberdata: async function transform(order) {
        items = [];
        for (let i = 0; i < order.restaurantOrder.items.length; i++) {
            let item = {
                item_id: order.restaurantOrder.items[i].uuid,
                item_name: order.restaurantOrder.items[i].title,
                item_price: Number(order.restaurantOrder.items[i].price),
                item_quantity: order.restaurantOrder.items[0].quantity
            }
            items.push(item);
        }
        let orders = {
            item: items,
         order_id: order.restaurantOrder.displayId,
         customer_name : order.restaurantOrder.customerInfo.firstName,
         customer_phone : order.restaurantOrder.customerInfo.phone,
         sub_total_charges : order.restaurantOrder.checkoutInfo[0].rawValue,
         total_tax : order.restaurantOrder.checkoutInfo[1].rawValue,
         total_charges : order.restaurantOrder.checkoutInfo[3].rawValue,
        // let item_id = order.restaurantOrder.items[0].uuid;
        // let item_name = order.restaurantOrder.items[0].title;//line.length
        // let item_price = Number(order.restaurantOrder.items[0].price);//ITEMS.LENGTH
        // let item_quantity = order.restaurantOrder.items[0].quantity;
         note : order.restaurantOrder.deliveryInstructions,
         status : order.deliveryJobDetails[0].jobStateSummary.currentState.type,//PICKED_UP_FOOD
         delivery_person_name : order.deliveryJobDetails[0].courierInfo.courier.name,
         delivery_person_phone :order.deliveryJobDetails[0].courierInfo.courier.mobileDigits,
         placed_time : order.restaurantOrder.createdAt,
         order_count : order.restaurantOrder.items.length,
         platform_name : "Uber-eats",
         est_delivery : order.deliveryJobDetails[0].estimatedTimes.estimatedDeliveryTime
        }
         let transformed_data = [orders];
        return transformed_data;
    }
}




                                            // left={Restaurant_Name,platform_name,}
                                            // Order Page:
                                            // OrderID+
                                            // Customer_Name+
                                            // Restaurant_Name-
                                            // Item_Name+
                                            // Note-//add customisation in orders-
                                            // Status-
                                            // Platform_Name-
                                            // No. of items-

                                            // OrderInfo Page:
                                            // Courier Tab-
                                            // Platform_Name
                                            // Delivery guy name-
                                            // Delivery guy phone no.
                                            // Status
                                            // Customer Tab-
                                            // Customer_Name
                                            // Customer_PhoneNo-
                                            // Address if available//add customer address
                                            // Right Column:
                                            // No. of items -
                                            // Customer Name+
                                            // Items_Name+
                                            // Item_price+
                                            // Item_Quantity-
                                            // Note-
                                            // Subtotal+
                                            // Tax+
                                            // Total+
                                            // Platform name+
                                            // Order_ID+
                                            // Placed On-//add order_time in order-
                                            // Status
                                            // Collapse

                                            // gkc/getOrders----all order info with filters and pagination;

                                            // gkc/getOrderDetails----all order info with filters and pagination;


                                            // gkc/confirm;---to confirm order;

                                            // gkc/pickup_ready;---to make orders ready for pickup;


                                            // gkc/completed;----for completed orders;











                                            // let grubhub_item = [item_id, item_name, item_price, item_quantity, grubhub_orders[0].order_number];

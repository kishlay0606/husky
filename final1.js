const token = require('./refresh_token');
const tokenu = require('./refresh_token2');

const transform = require('./transformer');
const transformer1=require('./transformer2')
const { Sequelize, QueryTypes } = require('sequelize');
const axios = require('axios');
const FIFTEENMINUTESINMS = 15*60*1000

async function run() {
    try {
        let branch_details_grubhub, branch_details_uber, token1, orders;
        // Get connection object
        let sequelize = await token.get_connection();

        // Startup setup
        await token.refreshToken(sequelize)

        // Refresh token every 15 minutes for all grubhub stores
        // TODO: Check time taken by refreshToken fn for 20,50 and 100 logins
        setInterval(token.refreshToken(sequelize), FIFTEENMINUTESINMS)



        setTimeout(async function refreshCookie() {
            branch_details_uber = await tokenu.get_branch(sequelize);
            for (let i = 0; i < branch_details_uber.length; i++) {
                await tokenu.create_update_cookie(branch_details_uber[i], sequelize);
            }
            setTimeout(refreshCookie, 600000);
        }, 0)


        setTimeout(async function syncOrders1() {
            try {
                for (let i = 0; i < branch_details_uber.length; i++) {
                    
                let cookie = await getCookie(sequelize, branch_details_uber[i]);
                let orders = await get_uber_orders(cookie,branch_details_uber[i]);
                console.log("syncorder1",orders);
                if (orders) {
                    console.log(orders[0]);
                    // await save_orders(orders[0], sequelize, branch_details);
                }
            }
            }
            catch (error) {
                console.log(error);
            }
            setTimeout(syncOrders1, 10000);
        }, 120000)



        setTimeout(async function syncOrders() {
            try {
                token1 = await getToken(sequelize, branch_details);
                orders = await get_orders(token1);
                if (orders) {
                    console.log(orders[0]);
                    await save_orders(orders[0], sequelize, branch_details);
                }
            }
            catch (error) {
                console.log(error);
            }
            setTimeout(syncOrders, 10000000);
        }, 300000000)

    } catch (error) {
        console.log(error)
    }
}


async function getCookie(sequelize, branch_details_uber) {
    try {
        let Branch_id = branch_details_uber.Branch_id;
        let session = await sequelize.query('SELECT * FROM session  WHERE Branch_id=?', { replacements: [Branch_id], type: QueryTypes.SELECT });
        return (session[0].cookie);
    } catch (error) {
        console.log(error);
    }
}

async function getToken(sequelize, branch_details) {
    try {
        let Branch_id = branch_details[0].Branch_id;
        let session = await sequelize.query('SELECT * FROM session  WHERE Branch_id=?', { replacements: [Branch_id], type: QueryTypes.SELECT });
        return (session[0].token);
    } catch (error) {
        console.log(error);
    }
}

async function get_orders(token) {
    try {
        let timestamp = new Date().getTime() - 300000;
        let url = "https://api-gtm.grubhub.com/merchant/2220052,2220818,2218384,2219349,2221715,2218188,2221811,2218970/orders?timestamp=" + timestamp;
        //   let url="https://api-gtm.grubhub.com/merchant/2220052,2220818,2218384,2219349,2221715,2218188,2221811,2218970/orders?tab=OUT_THE_DOOR&offset=0&limit=5"
        let res = await axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'authorization': token,
                'origin': 'https://restaurant.grubhub.com'
            }
        }).catch(err => {
            console.log("error in await", err);
        })
        let data = res.data;
        if (data) {
            for (let key in data) {
                if (data[key].orders) {
                    let grubhub_orders = await data[key].orders;
                    if (grubhub_orders.length > 0) {
                        for (let i = 0; i < grubhub_orders.length; i++) {
                            console.log(grubhub_orders[i]);
                            let transform_data = await transform.grubhub_transformer(grubhub_orders[i]);
                            console.log(transform_data);
                            return transform_data;
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}



async function get_uber_orders(cookie,branch_details) {
    let active_order_url = await "https://restaurant-dashboard.uber.com/rt/eats/v1/stores/" + branch_details.Branch_id + "/active-orders"
    let transport = axios.create({ withCredentials: true });
    let res = await transport.get(active_order_url, {
        headers: {
            'accept': '*/*',
            'cookie': cookie
        }
    })
    let data1 = await res.data.orders;
    if (data1) {
        if (data1.length > 0) {
            console.log(data1);
            for (i = 0; i < data1.length; i++) {
               let transformed_uber_data= await transformer1.transform_Uberdata(data1[i]);
               return transformed_uber_data;
            }
        }
    }
}

        async function save_orders(orders, sequelize, branch_details) {
            try {
                await sequelize.query('INSERT IGNORE into customer (customer_id,Name,phone) values(?,?,?)', { replacements: [orders.customer_id, orders.customer_name, orders.customer_phone], type: QueryTypes.INSERT });
                await sequelize.query('INSERT IGNORE into `order` (order_id,sub_total,tax,total,Branch_id,platform_id,customer_id,status,note) values(?,?,?,?,?,?,?,?,?)', { replacements: [orders.order_id, orders.sub_total_charges, orders.total_tax, orders.total_charges, branch_details[0].Branch_id, "2", orders.customer_id, orders.status, orders.note], type: QueryTypes.INSERT });
                console.log(orders.item.length);
                for (let i = 0; i < orders.item.length; i++) {
                    await sequelize.query('INSERT IGNORE into item (item_id,item_name,price,quantity,order_id) values(?,?,?,?,?)', { replacements: [orders.item[i].item_id, orders.item[i].item_name, orders.item[i].item_price, orders.item[i].item_quantity, orders.order_id], type: QueryTypes.INSERT });
                }
                await sequelize.query('INSERT IGNORE into `delivery` (Name,mobile,order_id) values(?,?,?)', { replacements: [orders.delivery_person_name, orders.delivery_person_phone, orders.order_id], type: QueryTypes.INSERT });

            } catch (error) {
                console.log(error);
            }

        }
        run();
        setTimeout(run, 800000);
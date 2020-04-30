import React, {useState, useReducer, useEffect} from "react"
import {
    Button,
    Divider,
    Dropdown,
    Grid
} from "semantic-ui-react";
import OrdersSideBar from "./OrdersSideBar";
import SummaryStatement from "./SummaryStatement";
import Promotions from "./Promotions";

const fakeOrders = {
    /* TODO: Active orders (restaurant pov) so get orders where dt_rider_departs_rest == null
    *  filter, sort desc order by dt_order_placed
    */
    uncompleted_orders: [
        {oid: 100123, totalCost: 49.5, deliveryFee: 4.1, cartCost: 45.4,
            promoApplied: null, paymentMode: "Cash On Delivery",
            deliveryLocation: "NUS Central Library", riderid: "benwang",
            dt_order_placed: "2020-02-22 19:10:25", dt_rider_departs: "2020-02-22 19:20:00",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 3, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 2, price: 2.9},
                {fid: 102, rid: 1000, rname: "LiWoW", fname: "Brown Sugar Fries", quantity: 3, price: 9.7}
            ]
        },
        {oid: 100100, totalCost: 10.1, deliveryFee: 3.2, cartCost: 9.9,
            promoApplied: {details: '$3 off on delivery fee', offset: 3},
            paymentMode: "Cash On Delivery",
            deliveryLocation: "Kent Ridge MRT Station Exit B", riderid: "chukai",
            dt_order_placed: "2020-02-22 09:10:25", dt_rider_departs: "2020-02-22 09:20:25",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ]
        },
        {oid: 100000, totalCost: 10.1, deliveryFee: 3.2, cartCost: 9.9,
            promoApplied: {details: '$3 off on delivery fee', offset: 3},
            paymentMode: "Cash On Delivery",
            deliveryLocation: "Kent Ridge MRT Station Exit B", riderid: "chukai",
            dt_order_placed: "2020-02-22 09:10:25", dt_rider_departs: "2020-02-22 09:20:25",
            dt_rider_arrives_rest: null, dt_rider_departs_rest: null, dt_order_delivered: null,
            cart: [
                {fid: 100, rid: 1000, rname: "LiWoW", fname: "Regular Milk Tea", quantity: 2, price: 3.5},
                {fid: 101, rid: 1000, rname: "LiWoW", fname: "Avocado Melon Tea", quantity: 1, price: 2.9}
            ]
        }
    ]
}

const fakeStats = {
    data: [
        /* TODO: period is concat of Month and Year of dt_order_placed
        *  sorted in descending order by month and year
        */
        {period: "March 2020", totalNumberOfOrders: 2000, totalProfit: 34000.20,
            topFavorites: [ // sorted in descending order by qty_sold
                {fid: 100, fname: "Avocado Milk Tea", qty_sold: 200},
                {fid: 101, fname: "Regular Milk Tea", qty_sold: 190},
                {fid: 102, fname: "Brown Sugar Fries", qty_sold: 123},
                {fid: 103, fname: "Brown Sugar Milk Tea", qty_sold: 103},
                {fid: 104, fname: "Creme Brulee", qty_sold: 73}
            ]
        },
        {period: "February 2020", totalNumberOfOrders: 1500, totalProfit: 20000.10,
            topFavorites: [
                {fid: 101, fname: "Regular Milk Tea", qty_sold: 150},
                {fid: 100, fname: "Avocado Milk Tea", qty_sold: 133},
                {fid: 102, fname: "Brown Sugar Fries", qty_sold: 80},
                {fid: 103, fname: "Brown Sugar Milk Tea", qty_sold: 73},
                {fid: 104, fname: "Creme Brulee", qty_sold: 65}
            ]
        }
    ]
}

const fakePromoStats = {
    data: [
        /* TODO: sorted in descending order by dt_start
        *  duration in hours (dt_end - dt_start)
        */
        {promoid: 1204, details: "33% on all food items", dt_start: "2020-03-13 09:00:00", dt_end: "2020-03-13 22:00:00", duration: 13, avgOrders: 921},
        {promoid: 1205, details: "10% on all food items", dt_start: "2020-03-01 09:00:00", dt_end: "2020-03-13 22:00:00", duration: 301, avgOrders: 762},
        {promoid: 1202, details: "Free Delivery", dt_start: "2020-02-20 09:00:00", dt_end: "2020-02-28 22:00:00", duration: 181, avgOrders: 562},
        {promoid: 1203, details: "24% on all food items", dt_start: "2020-02-13 09:00:00", dt_end: "2020-02-14 22:00:00", duration: 37, avgOrders: 777},
    ]
}

// flexible sort on array
// const sortBy = (field, array) => {
//     const key = array ? x => {return array(x[field])} : x => {return x[field]}
//     return (a, b) => {
//         return a = key(a), b = key(b), (a > b) - (b > a)
//     }
// }

const generateFilterOption = (stats) => {
    return stats.map(item => {
        return item.period
    })
}

const filterStats = (data, filter) => {
    return data.filter(item => item.period === filter)[0]
}

const reducer = (state, action) => {
    switch (action.type) {
        case "initialize":
            return {
                stats: action.payload,
                filterOptions: generateFilterOption(action.payload),
                filter: action.payload[0].period,
                filteredStats: filterStats(action.payload, action.payload[0].period)
            };
        case "filter":
            return {
                ...state,
                filter: action.payload,
                filteredStats: filterStats(state.stats, action.payload)
            };
        default:
            return state;
    }
}

export default function Summary() {
    const [orders, setOrders] = useState([])
    const [promotions, setPromotions] = useState([])

    const [filterSummary, setFilterSummary] = useReducer(reducer, {
        stats: [],
        filterOptions: [],
        filter: "",
        filteredStats: {}
    })
    const {stats, filterOptions, filter, filteredStats} = filterSummary

    const options = filterOptions.map(item => ({
        key: item,
        text: item,
        value: item
    }))

    useEffect(() => {
        (async() => {
            // TODO: (backend) code here for first rendering of page
            // only render uncompleted orders for restaurant (dt_rider_departs_rest == null)
            setOrders(fakeOrders.uncompleted_orders)
            setFilterSummary({type: "initialize", payload: fakeStats.data})
            setPromotions(fakePromoStats.data)
        })()
    }, [])

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={1}/>

                    <Grid.Column width={11} textAlign={"left"}>
                        <Grid.Row>
                            <h1>Summary of {' '}
                                <Dropdown
                                    inline
                                    options={options}
                                    value={filter}
                                    onChange={(e, { value }) => {
                                        setFilterSummary({type: "filter", payload: value})
                                    }}
                                />
                            </h1>
                            <SummaryStatement stats={filteredStats}/>
                        </Grid.Row>
                        <Divider/>
                        <Grid.Row>
                            <h1>Promotions</h1>
                            <Button floated={'right'} size={'mini'} color={'pink'}
                                    content={'Add Promo'}
                            />
                            <Promotions promotions={promotions}/>
                        </Grid.Row>
                    </Grid.Column>

                    <Grid.Column width={4}>
                        <h2>Pending Orders</h2>
                        <Divider/>
                        <OrdersSideBar orders={orders} className={'child'}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}
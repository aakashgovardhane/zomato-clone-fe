import axios from 'axios';
import React from 'react';
import queryString from 'query-string';

import Modal from 'react-modal';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


import './styles/overview.css'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        padding: '10px',
        backgroundColor: 'white',
        border: 'solid 2px brown',
        "text-align": "center",
        overflow: "scroll",
        "max-height": "70%"
    }
};

class Overview extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: undefined,
            menuItems: [],
            subTotal: 0,
            orderModalIsOpen: false,
        }
    }

    placeOrder = (state, value) => {
        const { restaurant } = this.state;
        this.setState({ [state]: value, menuItems: [], subTotal: 0 })
        if (state === 'orderModalIsOpen' && value === true) {
            axios({
                url: "https://z-be.herokuapp.com/getItemsbyrestaurant",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: { resId: restaurant._id }
            }).then(res => {
                this.setState({ menuItems: res.data.itemsList })
            }).catch(err => console.log(err))
        }
    }

    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType === 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
    }
    addToCart = () => {
        const { menuItems, subTotal } = this.state
        let existCart = [];
        const userid = sessionStorage.getItem("userid")
        if (userid) {
            if (subTotal > 0) {
                const filtered = menuItems.filter(item => {
                    return item.qty > 0;
                });
                axios({
                    url: "https://z-be.herokuapp.com/getuser",
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        "userId": userid
                    }
                }).then(
                    result => {
                        if (result.data.user.cart.length === 0) {
                            existCart = []
                        }else{
                            existCart = [...result.data.user.cart]
                        }
                    }
                )
                setTimeout(() => {
                    existCart.push(...filtered)
                    window.alert("Items Added To The Cart")
                    setTimeout(() => {
                        console.log(existCart)
                        axios({
                            url: "https://z-be.herokuapp.com/cart",
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            data: {
                                "userId": userid,
                                "cart": existCart
                            }
                        }).then(
                            result => {
                                if (result.data.updated) {
                                    this.setState({ orderModalIsOpen: false })
                                }
                            }
                        )
                    }, 500);
                }, 1000);
            } else {
                window.alert("Please Add Items")
            }
        } else {
            window.alert("Please login And Try Again")
        }
    }
    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { restID } = qs;
        axios({
            method: "POST",
            url: "https://z-be.herokuapp.com/getrestaurantbyid",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                restaurantId: restID
            }
        }).then(res => {
            this.setState({ restaurant: res.data.Restaurants })
        })
    }
    render() {
        const { restaurant, menuItems, orderModalIsOpen, subTotal } = this.state;
        return (
            <>
                {restaurant ? <div className="container topcontainer">
                    <img className="w-100" src={restaurant.thumb} />
                    <p1>{restaurant.name}</p1>
                    <div className="row justify-content-end place-order">
                        <button className="btn btn-outline-danger mr-3" onClick={() => this.placeOrder('orderModalIsOpen', true)}>Place an Order</button>
                    </div>

                    <Tabs>
                        <TabList>
                            <Tab><p3>Overview</p3></Tab>
                            <Tab><p3>Contact</p3></Tab>
                        </TabList>

                        <TabPanel>
                            <div className="content">
                                <div className="about">About this Place</div>
                                <div className="head">Cuisine</div>
                                <div className="value">{restaurant.Cuisine.map(i => { return `${i.name}, ` })}</div>
                                <div className="head">Average Cost</div>
                                <div className="value">&#8377; {restaurant.cost} for two Peoples(approx)</div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <div className="content">
                                <div className="head">Phone Number</div>
                                <div className="value">{restaurant.contact_number}</div>
                                <div className="head">{restaurant.name}</div>
                                <div className="value">{restaurant.address}</div>
                            </div>
                        </TabPanel>
                    </Tabs>
                    <Modal
                        isOpen={orderModalIsOpen}
                        style={customStyles}
                    >
                        <div >
                            <div className="fa fa-times" aria-hidden="true" style={{ float: 'right' }} onClick={() => this.placeOrder('orderModalIsOpen', false)}></div>
                            <h3 className="restaurant-name">{restaurant.name}</h3>
                            {menuItems.map((item, index) => {
                                return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                    <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                        <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                            <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                <span className="card-body">
                                                    <h5 className="item-name">{item.name}</h5>
                                                    <h5 className="item-name">&#8377;{item.price}</h5>
                                                    <p className="card-text">{item.description}</p>
                                                </span>
                                            </div>
                                            <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 mt-4"> <img className="card-img-center title-img mb-2" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                                {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                    <div className="add-number"><button className="m-2" onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button className="m-2" onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                            <h3>SubTotal : {subTotal}</h3>
                            <button className="btn btn-danger pay" onClick={this.addToCart}>Add to Cart</button>
                            <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>

                            </div>
                        </div>
                    </Modal>
                </div> : null}
            </>
        )
    }
}

export default Overview;
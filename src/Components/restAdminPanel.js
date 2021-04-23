import axios from 'axios';
import React from 'react';
import queryString from 'query-string'

class restAdmin extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurant: undefined,
            Orders: [],
            subTotal: 0,
            menuItems : []
        }
    }

    orderComplete = (orderId) => {
        axios({
            method: "POST",
            url: "https://z-be.herokuapp.com/completeOrder",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                orderId: orderId
            }
        }).then(res => {
            window.alert("Order Mark As Completed")
            axios({
                url: "https://z-be.herokuapp.com/getOrdersbyrestaurant",
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                data: { resId: this.state.restaurant._id }
            }).then(res => {
                this.setState({ Orders: res.data.Orders })
            }).catch(err => {
                console.log(err)
                window.alert("Something Went Wrong")
            })
        })
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
        axios({
            url: "https://z-be.herokuapp.com/getOrdersbyrestaurant",
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: { resId: restID }
        }).then(res => {
            this.setState({ Orders: res.data.Orders })
        }).catch(err => console.log(err))
    }
    render() {
        const { Orders } = this.state
        return (
            <div className="row justify-content-center container">
                <h1 className="col-12 m-3 text-center">Pending Orders</h1>
                {Orders ? Orders.map((item) => {
                    return <div className="col-6" style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <div className="card" style={{ margin: 'auto' }}>
                            <div className="row" style={{ paddingLeft: '50px', paddingBottom: '10px' }}>
                                <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                    <span className="card-body">
                                        <h5 className="item-name">{item.name}</h5>
                                        <h5 className="item-name">Quntity : {item.qty}</h5>
                                        <p1>Customer details</p1> <br />
                                        Name : {item.username} <br />
                                        Number : {item.number} <br />
                                        Address : {item.address}
                                    </span>
                                </div>
                                <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 mt-4"> <img className="card-img-center title-img mb-2" src={`../${item.image}`} style={{ height: '75px', width: '75px', 'border-radius': '20px' }} />
                                    <button className="btn btn-success btn-sm mt-2 mr-3" onClick={() => this.orderComplete(item._id)}>Complete Order</button>
                                </div>
                            </div>
                        </div>
                    </div>
                }) : null}
            </div>
        )
    }
}

export default restAdmin
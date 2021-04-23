import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: []
        }
    }
    
    restDetails = (event) => {
        console.log(event.target.value);
        this.props.history.push('/filter');
    }
    handleChange = (event) => {
        const locationId = event.target.value;
        sessionStorage.setItem('locationId', locationId);
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/getrestaurantlist',
            headers: { 'Content-Type': 'application/json' },
            data: {
                city_name: locationId
            }
        }).then(res => {
            this.setState({ restaurants: res.data.Restaurants })
        }).catch()
    }
    detailsPage = (event) => {
        const { restaurants } = this.state
        let restaurantName = event.target.value;
        restaurants.map(item => {
            if(item.name.toLowerCase() == restaurantName.toLowerCase()){
                this.props.history.push(`/overview/?restID=${item._id}`);
            } 
        })
    }

    componentDidMount(){
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/getrestaurantlist',
            headers: { 'Content-Type': 'application/json' },
            data: {
            }
        }).then(res => {
            this.setState({ restaurants: res.data.Restaurants })
        }).catch()
    }
    render() {
        const { locations } = this.props;
        const { restaurants } = this.state;
        return (
            <>
                <div className="brown-bg"></div>
                <div className="container-fluid text-center" id="logo-div">
                    <div className="container" id="logo-frame">
                        <div className="logo-text">e!</div>
                    </div>
                    <div className="hheading text-center">Find the best restaurants, cafés, and bars</div>
                    <div className="mobile-margin-head">
                        <select className="container" name="location" id="location" onChange={this.handleChange}>
                            <option>Please Select a location</option>
                            {
                                locations.map(item => {
                                    return <option value={item.city}>{item.city}</option>
                                })
                            }
                        </select>
                        <div className="search">
                            <i className="fa fa-search" aria-hidden="true"></i>
                            <input list="searchresults" type="text" onInput={this.detailsPage} multiple placeholder="Search for restaurants" />
                            <datalist id="searchresults">
                                {
                                    restaurants.map(item => {
                                        return <option value={item.name}>{item.name}</option>
                                    })
                                }
                            </datalist>
                        </div>
                    </div>
                </div>
                <img className="bg-img" src="./assets/bg.png"></img>

            </>)
    }
}
export default withRouter(Wallpaper);
import React from 'react';
import './styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            restaurants: [],
            totalpages: [],
            mealtype: undefined,
            location: undefined,
            cuisine: undefined,
            lcost: undefined,
            hcost: undefined,
            sort: 1,
            page: undefined
        }
    }

    handleClick = (resId) => {
        this.props.history.push(`/overview/?restID=${resId}`);
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { mealtype, area } = qs;

        axios({
            url: "https://z-be.herokuapp.com/locations",
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => this.setState({ "locations": res.data.locations }))
            .catch(err => console.log(err))

        // Call filter API 
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                mealtype: mealtype,
                city_name: area
            }
        }).then(res => {
            this.setState({ restaurants: res.data.Restaurants, mealtype: mealtype, location: area, page: 1, totalpages: res.data.totalpages })
        }).catch()
    }

    handleSortChange = (sort) => {
        const { mealtype, location, cuisine, lcost, hcost } = this.state;
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype: mealtype,
                city_name: location,
                cuisine: cuisine,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            this.setState({ page: 1, restaurants: res.data.Restaurants, sort: sort, totalpages: res.data.totalpages })
        }).catch()
    }

    handleCostChange = (lcost, hcost) => {
        const { mealtype, location, cuisine, sort } = this.state;
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype: mealtype,
                city_name: location,
                cuisine: cuisine,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            this.setState({ page: 1, restaurants: res.data.Restaurants, lcost: lcost, hcost: hcost, totalpages: res.data.totalpages })
        }).catch()
    }

    handleCuisineChange = (cuisineid) => {
        let { mealtype, location, cuisine, sort, lcost, hcost } = this.state;
        if (cuisine === undefined) {
            cuisine = [];
        }
        if (cuisine.indexOf(cuisineid) === -1) {
            cuisine.push(cuisineid);
        }
        else {
            var index = cuisine.indexOf(cuisineid);
            cuisine.splice(index, 1);
        }
        if (cuisine.length === 0) {
            cuisine = undefined;
        }
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype: mealtype,
                city_name: location,
                cuisine: cuisine,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            this.setState({ page: 1, restaurants: res.data.Restaurants, cuisine: cuisine, totalpages: res.data.totalpages })
        }).catch()
    }

    handleLocationChange = (event) => {
        const { mealtype, sort, cuisine, lcost, hcost } = this.state;
        let city = event.target.value;
        if (city === -1) {
            city = undefined
        }
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype: mealtype,
                city_name: city,
                cuisine: cuisine,
                lcost: lcost,
                hcost: hcost
            }
        }).then(res => {
            this.setState({ page: 1, restaurants: res.data.Restaurants, location: city, totalpages: res.data.totalpages })
        }).catch()
    }

    handlePageChange = (page) => {
        const { mealtype, sort, cuisine, lcost, hcost, location } = this.state;
        if (page === -1) {
            page = this.state.page - 1;
            if (page === 0) {
                page = 1
            }
        }
        if (page === -2) {
            page = this.state.page + 1;
            if (page === this.state.totalpages.length + 1) {
                page = this.state.page
            }
        }
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sort: sort,
                mealtype: mealtype,
                city_name: location,
                cuisine: cuisine,
                lcost: lcost,
                hcost: hcost,
                page: page
            }
        }).then(res => {
            this.setState({ restaurants: res.data.Restaurants, page: page, totalpages: res.data.totalpages })
        }).catch()
    }

    clearFilters = () => {
        axios({
            method: 'POST',
            url: 'https://z-be.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: {
            }
        }).then(res => {
            this.props.history.push('/filter')
            this.setState({ sort:1,restaurants: res.data.Restaurants, mealtype: undefined, location: undefined, page: 1,cuisine:undefined,lcost: undefined,hcost: undefined, totalpages: res.data.totalpages })
        }).catch()
    }

    render() {
        let { restaurants, locations, totalpages, page, sort, lcost, hcost, cuisine, location } = this.state;
        if (cuisine === undefined) {
            cuisine = []
        }
        return (
            <>
                <div className="container-fluid">
                <div className="heading d-inline-block">Breakfast Places in Mumbai</div>
                <button className="btn btn-outline-primary mr-5 mt-3 float-right" onClick={this.clearFilters}>Clear filters</button>
                </div>
                <div className="filter-options container">
                    <div id="filtershead" className="d-inline">Filters</div>
                    <div className="filter-types">
                        <div className="type-heading">Select Location</div>
                        <div className="type-options"><select id="selectloc" onChange={this.handleLocationChange}>
                            {location === undefined ? <option style={{ "color": "black" }} className="locopt" value="-1">All Locations</option> : <option className="locopt" value="-1">All Locations</option>}
                            {
                                locations.map(item => {
                                    return <>
                                        {location === item.city ? <option selected style={{ "color": "black" }} className="locopt" value={item.city}>{item.city}</option> : <option className="locopt" value={item.city}>{item.city}</option>}
                                    </>

                                })
                            }
                        </select>
                        </div>
                    </div>
                    <div className="filter-types">
                        <div className="type-heading">Cuisine</div>
                        {cuisine.indexOf(1) === -1 ? <div className="type-options"><input className="check-box" type="checkbox" onChange={() => { this.handleCuisineChange(1) }} /> North Indian</div> : <div style={{ "color": "black" }} className="type-options"><input className="check-box" type="checkbox" checked onChange={() => { this.handleCuisineChange(1) }} /> North Indian</div>}
                        {cuisine.indexOf(2) === -1 ? <div className="type-options"><input className="check-box" type="checkbox" onChange={() => { this.handleCuisineChange(2) }} /> South Indian</div> : <div style={{ "color": "black" }} className="type-options"><input className="check-box" type="checkbox" checked onChange={() => { this.handleCuisineChange(2) }} /> South Indian</div>}
                        {cuisine.indexOf(3) === -1 ? <div className="type-options"><input className="check-box" type="checkbox" onChange={() => { this.handleCuisineChange(3) }} /> Chinese</div> : <div style={{ "color": "black" }} className="type-options"><input className="check-box" type="checkbox" checked onChange={() => { this.handleCuisineChange(3) }} /> Chinese</div>}
                        {cuisine.indexOf(4) === -1 ? <div className="type-options"><input className="check-box" type="checkbox" onChange={() => { this.handleCuisineChange(4) }} /> Fast Food</div> : <div style={{ "color": "black" }} className="type-options"><input className="check-box" type="checkbox" checked onChange={() => { this.handleCuisineChange(4) }} /> Fast Food</div>}
                        {cuisine.indexOf(5) === -1 ? <div className="type-options"><input className="check-box" type="checkbox" onChange={() => { this.handleCuisineChange(5) }} /> Street Food</div> : <div style={{ "color": "black" }} className="type-options"><input className="check-box" type="checkbox" checked onChange={() => { this.handleCuisineChange(5) }} /> Street Food</div>}
                    </div>
                    <div className="filter-types">
                        <div className="type-heading">Cost For Two</div>
                        {lcost === 1 && hcost === 500 ? <div className="type-options" style={{ "color": "black" }}><input name="cost" type="radio" checked onChange={() => { this.handleCostChange(1, 500) }} /> Less Than &#8377;500</div> : <div className="type-options"><input name="cost" type="radio" onChange={() => { this.handleCostChange(1, 500) }} /> Less Than &#8377;500</div>}
                        {lcost === 500 && hcost === 1000 ? <div className="type-options" style={{ "color": "black" }}><input name="cost" type="radio" checked onChange={() => { this.handleCostChange(1, 500) }} /> &#8377;500 to &#8377;1000</div> : <div className="type-options"><input name="cost" type="radio" onChange={() => { this.handleCostChange(500, 1000) }} /> &#8377;500 to &#8377;1000</div>}
                        {lcost === 1000 && hcost === 1500 ? <div className="type-options" style={{ "color": "black" }}><input name="cost" type="radio" checked onChange={() => { this.handleCostChange(1, 500) }} /> &#8377;1000 to &#8377;1500</div> : <div className="type-options"><input name="cost" type="radio" onChange={() => { this.handleCostChange(1000, 1500) }} /> &#8377;1000 to &#8377;1500</div>}
                        {lcost === 1500 && hcost === 2000 ? <div className="type-options" style={{ "color": "black" }}><input name="cost" type="radio" checked onChange={() => { this.handleCostChange(1, 500) }} /> &#8377;1500+</div> : <div className="type-options"><input name="cost" type="radio" onChange={() => { this.handleCostChange(1500, 2000) }} /> &#8377;1500+</div>}
                    </div>
                    <div className="filter-types">
                        <div className="type-heading">Sort</div>
                        {sort === 1 ? <div style={{ "color": "black" }} className="type-options"><input name="order" type="radio" checked="checked" onChange={() => { this.handleSortChange(1) }} /> Price low to high</div> : <div className="type-options"><input name="order" type="radio" onChange={() => { this.handleSortChange(1) }} /> Price low to high</div>}
                        {sort === -1 ? <div style={{ "color": "black" }} className="type-options"><input name="order" type="radio" checked="checked" onChange={() => { this.handleSortChange(-1) }} /> Price High to Low</div> : <div className="type-options"><input name="order" type="radio" onChange={() => { this.handleSortChange(-1) }} /> Price High to Low</div>}
                    </div>
                </div>
                <div className="fcontainer">
                    {restaurants.length !== 0 ? restaurants.map((item) => {
                        return <div className="filtered-places" onClick={() => { this.handleClick(item._id) }}>
                            <div className="img-details">
                                <img className="img" src={item.thumb} />
                                <div className="details">
                                    <div className="details-heading">{item.name}</div>
                                    <div className="details-type">{item.address}</div>
                                    <div className="Adress">{item.city_name}</div>
                                </div>
                            </div>
                            <div className="devider"></div>
                            <div className="type-price">
                                <div className="filtered-options">
                                    CUISINES: <br />
                        COST FOR TWO:
                            </div>
                                <div className="filtered-selected">
                                    {item && item.Cuisine ? item.Cuisine.map(i => { return `${i.name}, ` }) : null} <br />
                                &#8377; {item.cost}
                                </div>
                            </div>
                        </div>
                    }) : <div class="no-records"> No Records Found ... </div>}
                </div>
                {restaurants.length !== 0 ? <div className="page-numbers text-align-center">
                    {totalpages.length > 1 ? <button className="number-frame" onClick={() => this.handlePageChange(-1)}>
                        <div className="num">&lt;</div>
                    </button> : null}
                    {totalpages.map(item => {
                        return <>{page === item ? <button className="number-frame" onClick={() => this.handlePageChange(item)} style={{ "background-color": "#636f88" }}>
                            <div className="num" style={{ "color": "white" }}>{item}</div>
                        </button> : <button className="number-frame" onClick={() => this.handlePageChange(item)}>
                            <div className="num">{item}</div>
                        </button>} </>
                    })}
                    {totalpages.length > 1 ? <button className="number-frame" onClick={() => this.handlePageChange(-2)}>
                        <div className="num">&gt;</div>
                    </button> : null}
                </div> : null}

            </>
        )
    }
}

export default Filter;
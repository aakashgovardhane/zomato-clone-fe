import axios from 'axios';
import React from 'react';

import './styles/Home.css'
import Wallpaper from './Wallpaper'
import QuickSearches from './QuickSearches'


class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: [],
            mealtypes: []
        }
    }

    componentDidMount() {
        axios({
            url: "http://localhost:2000/locations",
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => this.setState({ "locations": res.data.locations }))
            .catch(err => console.log(err))

        axios({
            url: "http://localhost:2000/mealtypes",
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).then(res => this.setState({ "mealtypes": res.data.mealtypes }))
        .catch(err => console.log(err))
    }

    render() {
        return (
            <>
                <Wallpaper locations={this.state.locations} />
                <QuickSearches mealtypes={this.state.mealtypes} />
            </>
        )
    }
}

export default Home
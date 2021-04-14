import React from 'react'

import Mealtypes from "./Mealtypes"
class QuickSearches extends React.Component {
    render() {
        const {mealtypes} = this.props ;
        return (
            <>
                <div className="container">
                    <div className="q-heading">Quick Searches</div>
                    <div className="detail-search">Discover restaurants by type of meal</div>
                </div>
                <div className="container" id="item-wrapper">
                   <Mealtypes mealtypes={mealtypes}/>
                </div>
            </>
        )
    }
}

export default QuickSearches ;
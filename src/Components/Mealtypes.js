import React from 'react'
import { withRouter } from 'react-router-dom';

class Mealtypes extends React.Component {
    handleClick = (mealTypeId) => {
        const locationId = sessionStorage.getItem('locationId');
        if (locationId) {
            this.props.history.push(`/filter/?mealtype=${mealTypeId}&area=${locationId}`);
        }
        else {
            this.props.history.push(`/filter/?mealtype=${mealTypeId}`);
        }
    }

    render() {
        const { mealtypes } = this.props;
        return (
            <>
            {
            mealtypes.map(item => {
                return <div className="item-frame" onClick={() => this.handleClick(item.mid)}>
                    <img className="item-img" src={item.image}/>
                    <div className="item-head-details">
                        <div className="item-heading">{item.name}</div>
                        <div className="item-details">{item.content}</div>
                    </div>
                </div>
            })
            }
            </>
        )
    }
}

export default withRouter(Mealtypes);
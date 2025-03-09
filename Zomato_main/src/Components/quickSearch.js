import React from 'react';
import './Style/Home.css';
import Welcome3 from './searchItem';

class quickSearch extends React.Component{
    render(){
        const { mealData } = this.props;
        return(
            <div>

                <div className="container mt-5 mb-5">
                    <div className="row">
                        <div>
                            <h3 className="heading">Quick Searches</h3>
                            <p className="subheading">Discover restaurants by type of meal</p>
                        </div>
                    </div>
                        
                    <Welcome3 data = { mealData } />
                    
                </div>

            </div>
        )
    }
}

export default quickSearch;
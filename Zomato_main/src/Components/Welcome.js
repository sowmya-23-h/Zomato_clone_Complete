import React from 'react';
import './Style/Home.css';
import navHook from './nav';
import axios from 'axios';

class Welcome extends React.Component{
    constructor() {
        super();
        this.state = {
            restaurant:[],
            inputText:undefined,
            suggestions: []
        }
    }
    handleLocation = (loaction) => {
        let locationID = loaction.target.value;
        locationID = locationID.toLowerCase();
        axios({
            url:`http://localhost:5502/restaurant/${locationID}`,
            method: 'GET',
            headers: {'Content-Type':'application/JSON'}    
        })
        .then(res => {
            this.setState({restaurant: res.data.restaurantlist})
        })
        .catch(err => console.log(err))
    }
    
    handleInput = (event) =>{
        const {restaurant} = this.state;
        const inputText = event.target.value;

        let suggestions = [];

        suggestions = restaurant.filter(item => item.name.toLowerCase().includes(inputText.toLowerCase()));
        this.setState({inputText, suggestions})
    }
    showSuggestions = () => {
        const { suggestions, inputText } = this.state;

        if (suggestions.length === 0 && inputText === undefined) {
            return null;
        }
        if (suggestions.length> 0 && inputText === '') {
            return null;
        }
        if (suggestions.length === 0 && inputText) {
            return(
                <li className='Suggnon'> No search result found </li>
            )
        }
            return(
                suggestions.map((item) =>(
                        <li className='suggimgbox' onClick={() => this.selectRestaurant(item._id)}>
                            <img src={`${item.thumb}`} alt={`${item.city_name} wallpapper`} className='suggImg'/>
                            <span className='suggTitle'>{ item.name }</span><br />
                            <span className='suggAddress'>{ item.locality }</span>
                        </li>
                ))
            )
    }
    selectRestaurant = (value) => {
        this.props.navigate(`/details?restaurant=${value}`);
    }

    render(){
        const { locationData } = this.props;

        return(
            <div>
                
                {/* <!--Banner Part (upper)--> */}

                <div className="bg-cover bg-image d-flex">
                    <div className="container mt-3">
                        <div className="row">
                            <div className="col text-end">
                                {/*<button type="button" className="btn btn-outline-light welLog">Login</button>
                                <button type="button" className="btn btn-outline-light welAcc">Create an account</button>*/}
                            </div>
                        </div>
                        <div className="Homlogo">  {/*<!-- Logo -->*/}
                            <a href="https://www.edureka.co/" target="_blank" rel="noopener noreferrer" className='logotxt'> e! </a>
                        </div>
                        <div className="head-text">
                            <p>Find the best restaurants, cafés, and bars</p>
                        </div>
                        <div className="row mt-3 d-flex justify-content-center">
                            <div className="col selectbar">
                                <select className="form-control input1 py-3" onChange={this.handleLocation} >
                                    { locationData.map((item) => {
                                        return(
                                            <option value={ item.city } className='selectTxt'>{ item.name }</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col input-group searchbar">
                                <i className="input-group-text bi bi-search input2"></i>
                                <input type="text" className="form-control input2 py-3" placeholder="Search for restaurants" onChange={this.handleInput} />
                                <ul className='sugg_box'>{ this.showSuggestions() }</ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}

export default navHook(Welcome);
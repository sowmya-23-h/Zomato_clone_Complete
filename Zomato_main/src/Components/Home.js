import React from 'react';
import axios from 'axios';
import Welcome from './Welcome';
import Welcome2 from './quickSearch';
import './Style/Home.css';


class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            locations: [],
            mealtype: []
        }
    }
    componentDidMount(){
        /*locations Axios*/
        axios({
            url:'http://localhost:5502/locations',
            method: 'GET',
            headers: {'Content-Type':'application/JSON'}
        })
        .then(res => {
            this.setState({locations: res.data.cityList})
        }).catch(err => console.log(err))
        /*mealtype Axios*/
        axios({
            url:'http://localhost:5502/mealtype',
            method: 'GET',
            headers: {'Content-Type':'application/JSON'}
        })
        .then(res => {
            this.setState({ mealtype: res.data.mealList })
        }).catch(err => console.log(err))
    }
    render(){
        const { locations, mealtype } = this.state;
        return(
            <div>
                <Welcome locationData = { locations }/>

                <Welcome2 mealData = { mealtype } />

            </div>
        )
    }
}

export default Home;
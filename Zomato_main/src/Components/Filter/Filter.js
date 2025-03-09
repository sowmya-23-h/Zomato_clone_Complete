import React from "react";
import '../Style/Filter.css'
import axios from "axios";
import queryString from "query-string";
import navHook from "../nav";
//import Header from "../Header";
class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mealType: [],
            restaurant: [],
            locations: [],
            location: undefined,
            title: "India",
            page: 1,
            sort: 1,
            cuisine: [],
            lcost: 0,
            hcost: 0,
            activePage: 1,
        }
    }
    componentDidMount() {
        const q = queryString.parse(window.location.search);
        const { type } = q;
        this.setState({ mealType: type })

        axios({
            url: 'http://localhost:5502/locations',
            method: 'GET',
            headers: { 'Content-Type': 'application/JSON' }
        })
            .then(res => {
                this.setState({ locations: res.data.cityList })
            }).catch(err => console.log(err))

        /*Filter Axios*/
        axios({
            url: `http://localhost:5502/filter`,
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' }
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant })
            }).catch(err => console.log(err))

    }
    handleLocation = (loc) => {
        let location = loc.target.value;
        let title = loc.target.value;
        location = location.toLowerCase()
        this.setState({ title })
        const { mealType } = this.state;
        const filterObj = {
            mealType: mealType,
            location: location
        }
        axios({
            url: 'http://localhost:5502/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant, location })
            }).catch(err => console.log(err))

    }
    pagination = (action) => {
        const { mealType, location, sort, cuisine, page } = this.state;

        let nextPage = page;

        if (action === 'next') {
            nextPage++;
        } else if (action === 'previous' && nextPage > 1) {
            nextPage--;
        } else if (!isNaN(action)) {
            nextPage = parseInt(action);
        }

        const filterObj = {
            mealType: mealType,
            location: location,
            page: nextPage,
            sort,
            cuisine: cuisine.length > 0 ? cuisine : undefined
        };

        axios({
            url: 'http://localhost:5502/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant, page: nextPage, activePage: nextPage });
            })
            .catch(err => console.log(err));
    }
    handleSort = (sort) => {
        const { mealType, location, page, cuisine } = this.state;

        const filterObj = {
            mealType: mealType,
            location: location,
            page,
            sort,
            cuisine: cuisine.length > 0 ? cuisine : undefined
        }
        axios({
            url: 'http://localhost:5502/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant, sort })
            }).catch(err => console.log(err))
    }
    handleCuisineChange = (i) => {
        let tempCuisine = this.state.cuisine.slice();

        if (tempCuisine.indexOf(i) === -1) {
            tempCuisine.push(i);
        } else {
            tempCuisine.splice(tempCuisine.indexOf(i), 1);
        }
        const { mealType, location, page, sort } = this.state;
        const filterObj = {
            mealType: mealType,
            location: location,
            page,
            sort,
            cuisine: tempCuisine.length > 0 ? tempCuisine : undefined
        }
        axios({
            url: 'http://localhost:5502/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant, cuisine: tempCuisine })
            }).catch(err => console.log(err))
    }
    handleCuisineCost = (min, max) => {

        const { mealType, location, sort, cuisine, page } = this.state;
        const lcost = min;
        const hcost = max;
        const filterObj = {
            mealType: mealType,
            location: location,
            lcost: lcost,
            hcost: hcost,
            page,
            sort,
            cuisine: cuisine.length > 0 ? cuisine : undefined
        }
        axios({
            url: 'http://localhost:5502/filter',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: filterObj
        })
            .then(res => {
                this.setState({ restaurant: res.data.filterRestaurant, lcost, hcost })
            }).catch(err => console.log(err))
    }
    navigateDetailsPage = (resId) => {
        this.props.navigate(`/details?restaurant=${resId}`);
    }
    render() {
        const { mealType, restaurant, locations, title } = this.state;
        return (
            <div>
                <div className="filpage">
                    <div className="filnavbar">
                        {/*<!-- Logo -->*/}
                        <div className="fillogo">
                            <div className="elogo">
                                <p className="tlogo">
                                    e!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="heading">
                        {mealType ?
                            <p> {mealType} Places in {title} </p>
                            :
                            <p> Best Restaurent in India</p>
                        }
                    </div>
                    {/*<!-- Filter -->*/}
                    <div className="bakeleft">
                        <div className="filter">
                            <p className="fil">
                                Filters
                            </p>
                            {/*<!-- Location -->*/}
                            <div className="Location">
                                <label className="loc">
                                    Select Location
                                </label>

                                <select className="locopt" onChange={this.handleLocation}>
                                    {locations.map((item) => {
                                        return (
                                            <option value={item.city} className='selectTxt'>{item.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            {/*<!-- Cuisine -->*/}
                            <div className="cuisine">
                                <form>
                                    <p className="namecus">
                                        Cuisine
                                    </p>
                                    <div className="cusitem">
                                        <span className="checkbox">
                                            <input type="checkbox" name="food-type" id="north" value="Noth India" onChange={() => this.handleCuisineChange(1)} />
                                            <label for="north">Noth India</label>
                                        </span>
                                        <span className="checkbox">
                                            <input type="checkbox" name="food-type" id="South" value="South India" onChange={() => this.handleCuisineChange(2)} />
                                            <label for="South">South India</label>
                                        </span>
                                        <span className="checkbox">
                                            <input type="checkbox" name="food-type" id="Chinese" value="Chinese" onChange={() => this.handleCuisineChange(3)} />
                                            <label for="Chinese"> Chinese </label>
                                        </span>
                                        <span className="checkbox">
                                            <input type="checkbox" name="food-type" id="Fast" value="Fast Food" onChange={() => this.handleCuisineChange(4)} />
                                            <label for="Fast"> Fast Food </label>
                                        </span>
                                        <span className="checkbox">
                                            <input type="checkbox" name="food-type" id="Street" value="Street Food" onChange={() => this.handleCuisineChange(5)} />
                                            <label for="Street"> Street Food </label>
                                        </span>
                                    </div>
                                </form>
                            </div>
                            {/*<!--Cost For Two -->*/}
                            <div>
                                <form>
                                    <p className="costfor">
                                        Cost For Two
                                    </p>
                                    <div className="costs">
                                        <span className="twocost">
                                            <input type="radio" name="cost" id="500" value="500" onChange={() => this.handleCuisineCost(0, 500)} />
                                            <label for="500">Less than ₹500 </label>
                                        </span>
                                        <span className="twocost">
                                            <input type="radio" name="cost" id="1000" value="1000" onChange={() => this.handleCuisineCost(500, 1000)} />
                                            <label for="1000">₹500 to ₹1000</label>
                                        </span>
                                        <span className="twocost">
                                            <input type="radio" name="cost" id="1500" value="1500" onChange={() => this.handleCuisineCost(1000, 1500)} />
                                            <label for="1500"> ₹1000 to ₹1500 </label>
                                        </span>
                                        <span className="twocost">
                                            <input type="radio" name="cost" id="2000+" value="2000" onChange={() => this.handleCuisineCost(1000, 2000)} />
                                            <label for="2000+"> ₹1500 to ₹2000 </label>
                                        </span>
                                        <span className="twocost">
                                            <input type="radio" name="cost" id="2000" value="2001" onChange={() => this.handleCuisineCost(2000, 0)} />
                                            <label for="Street"> ₹2000+ </label>
                                        </span>
                                    </div>
                                </form>
                            </div>
                            {/*<!-- sort -->*/}
                            <div>
                                <p className="sorthe">
                                    Sort
                                </p>
                                <div className="sortord">
                                    <p>
                                        <input type="radio" name="Sort" id="high" value="Price low to high" onChange={() => this.handleSort(1)} />
                                        <label for="high"> Price low to high </label>
                                    </p>
                                    <p>
                                        <input type="radio" name="Sort" id="low" value="Price high to low" onChange={() => this.handleSort(-1)} />
                                        <label for="low"> Price high to low </label>
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div className="bakecontainer">
                            {restaurant.length > 0 ?
                                restaurant.map((item) => {
                                    return (
                                        <div className="bakecontainer-1" onClick={() => this.navigateDetailsPage(item._id)}>
                                            <div className="content-img">
                                                <img src="./Images/Breakfast.png" alt="Breakfast" className="food-img" />
                                            </div>
                                            <div className="content-text">
                                                <p className="Chill">{item.name}</p>
                                                <p className="fort">{item.locality}</p>
                                                <p className="address">
                                                    {item.address}
                                                </p>
                                            </div>
                                            <br />
                                            <hr className="line" />
                                            <div className="content-text-2">
                                                <div className="cost-text">
                                                    CUISINES: <br /><br />
                                                    COST FOR TWO:
                                                </div>
                                                <div className="cost">
                                                    {item.Cuisine.map((data) => `${data.name}  `)} <br /> <br />
                                                    {item.cost}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : <div className="bakecontainer-1"> <p className="noResult">Sorry. No result found</p></div>}


                            {/*<!--Page Number-->*/}
                            <div>
                                <div className="pagination">
                                    <button className="pagenext" onClick={() => this.pagination('previous')}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                    {
                                        [1, 2, 3, 4, 5].map((pageNum) => (
                                            <button
                                                className={`pagenum ${pageNum === this.state.activePage ? 'active' : ''}`}
                                                onClick={() => this.pagination(pageNum)}
                                                key={pageNum}
                                            >
                                                {pageNum}
                                            </button>
                                        ))
                                    }
                                    <button className="pageperv" onClick={() => this.pagination('next')}>
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default navHook(Filter);
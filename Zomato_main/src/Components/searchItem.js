import React from 'react';
import './Style/Home.css';
import navHook from './nav';
class searchItem extends React.Component{
    navigateFilterPage = (id) => {
        this.props.navigate(`/filter?type=${id}`);
        }
    render(){
       const {data} = this.props;

        return(
            <div>
                    {/* <!--Box 1-->*/}
                    <div className="d-flex flex-wrap">
                        { data.map((meal) => {
                            return(
                                <div onClick={() => this.navigateFilterPage(meal.name)}>
                                    <div className='d-flex box mt-4' >
                                        <div className="l-box">
                                                <img src= {`./Images/${ meal.image }`} alt={`${meal.image}`} className="img-fluid img-qs " />
                                        </div>

                                        <div className="r-box">
                                                <h3 className="card-title ">
                                                { meal.name }
                                                </h3>
                                                <p className="card-content ">
                                                Start your day with exclusive { meal.name } options.
                                                </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
        )
    }
}

export default navHook(searchItem);
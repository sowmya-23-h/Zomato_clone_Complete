import React from 'react';
//import Header from './Header';
import queryString from "query-string";
import axios from "axios";
import './Style/Details.css';
import Modal from "react-modal";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const customStyles = {
  overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.9)"
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
  },
};


class Details extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            restaurant: {},
            resID:undefined,
            menuItems: [],
            menuModalOpen: false,
            Name:undefined,
            Address:undefined,
            MobileNumber:undefined,
            averageCost: 0,
            menu:[]
        }
    } 
    componentDidMount() {
      const qs = queryString.parse(window.location.search);
      const { restaurant } = qs;

      axios({
        url: `http://localhost:5502/restaurants/${restaurant}/`,
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' }
      })
        .then(res => {
          this.setState({ restaurant: res.data.restaurantOne, resID: restaurant }, () => {
            // After receiving restaurant data, fetch menu items and calculate average cost
            this.fetchMenuItemsAndCalculateAverageCost();
          });
        })
        .catch(err => console.log(err));
      
    }

    fetchMenuItemsAndCalculateAverageCost() {
      const { resID } = this.state;
      axios({
        url: `http://localhost:5502/menu/${resID}/`,
        method: 'GET',
        headers: { 'Content-Type': 'application/JSON' }
      })
        .then(res => {
          const menu = res.data.restaurantsMenu;
          this.setState({ menu }, () => {
            const averageCost = this.calculateAverageCost();
            this.setState({ averageCost });
          });
        })
        .catch(err => console.log(err));
    }

    handleModal = (state, value) => {
      const { resID } = this.state;
    
      if (state === "menuModalOpen" && value === true) {
        axios({
          url: `http://localhost:5502/menu/${resID}/`,
          method: 'GET',
          headers: { 'Content-Type': 'application/JSON' }
        })
          .then(res => {
            this.setState({ menuItems: res.data.restaurantsMenu });
          })
          .catch(err => console.log(err));
      }
    
      this.setState({ [state]: value });
    }
    addItems = (index, operationType) => {
      let total = 0;
      const items = [...this.state.menuItems];
      const item = items[index];

      if (operationType === 'add'){
          item.qty += 1;      //  item.qty = item.qty + 1
      }else{
          item.qty -= 1;      //  item.qty = item.qty - 1
      }

      items[index] = item;

      items.map((x) => {
          return total += x.qty * x.price;   // total = total + (x.qty * x.price)
      })
      this.setState({ menuItems: items, subtotal: total})
  }

  initpayment = (data) => {
    const options = {
      key: "rzp_test_7DOE3bCxTjORtd",
      amount: data.amount,
      currency: data.currency,
      description: "test trasaction",
      order_id: data.id,
    }
    const razor = new window.Razorpay(options);
    razor.open();
  }
  hadlePayment = async () => {
    const { subtotal } = this.state;

    try{
      const orderUrl = "http://localhost:5502/api/payment/orders";
      const { data } = await axios.post(orderUrl, { amount: subtotal });
      this.initpayment(data.data);
    }catch(err) {
      console.log(err);
    }
  } 
  // Insert to Name
  setName = (i) => {
    this.setState({ Name: i.target.value });
}

// Insert to Mail
setNumber = (i) => {
    this.setState({ MobileNumber: i.target.value });
}

// Insert to Password
setAddress = (i) => {
    this.setState({ Address: i.target.value });
}
  handleUser = () =>{
    const {Name, MobileNumber, Address } = this.state;

  const regObj = {
    Name: Name, 
    MobileNumber: MobileNumber, 
    Address: Address
  }
  
  axios({
      url: 'http://localhost:5502/user',
      method: 'POST',
      headers: { 'Content-Type': 'application/JSON' },
      data: regObj
  })
      .then(res => {
      this.setState({ users: res.data.Detail._id })
      })
      .catch(err => console.log(err))

  }
  handleButtonClick () {
  this.hadlePayment();
  this.handleUser();
  this.handleModal('formModal', false);
  }

  renderCuisineList() {
    const { Cuisine } = this.state.restaurant;

    if (!Cuisine) {
      // Handle the case where Cuisine is undefined or empty
      return <p>No cuisine data available.</p>;
    }

    return (
      <ol>
        {Cuisine.map(cuisine => (
          <li key={cuisine._id} className='cuisineText mt-2'>
            {cuisine.name}
          </li>
        ))}
      </ol>
    );
  }

  calculateAverageCost() {
    const { menu } = this.state;
    if (menu && menu.length > 0) {
      const totalCost = menu.reduce((acc, item) => acc + parseFloat(item.price), 0);
      return (totalCost / menu.length).toFixed(2);
    } else {
      return 0; // Handle the case where there are no menu items
    }
  }
  render() {
    const { restaurant, menuItems, menuModalOpen, subtotal, galleryModal, formModal, averageCost,menu } = this.state;
    return (
      <div>
        {console.log(menu)}
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
          <div>
            <div class="container d-flex img-fluid mt-5">
                <img src={`${restaurant.thumb}`} alt='thumb' className='detBgCover'/>
            </div>
            <button className='imgButton' onClick={() => this.handleModal("galleryModal", true)}>Click to see Image Gallery</button>
            <button className='orderButton' onClick={() => this.handleModal("menuModalOpen", true)}>Place Online Order</button>
            <h1 className='chilltxt container mt-5'>{ restaurant.name }</h1>      
          </div>
          {/*<Tabs value={ restaurant }/>*/}
          <div className='tabs'>
            <hr className='line'/>
            <div className='tab'>
              <input type='radio' id='tab-1' name= 'tab_troup' checked/>
                <label for= 'tab-1' className='overview'>Overview</label>
                <div className='content'>
                  <h1 className='Title'>About this place</h1>
                  <br /> <br />
                  <h4 className='SubTitle'>Cuisine</h4>
                  {this.renderCuisineList()} <br />
                  <h4 className='SubTitle'>Average Cost</h4>
                  <p className='titleText'>₹{averageCost} for one person(approx.)</p>
                </div>
            </div>
            <div className='tab'>
            <input type='radio' id='tab-2' name= 'tab_troup'/>
              <label for='tab-2' className='overview'>Contact</label>
              <div className='content'>
                <h4 className='SubTitle'>Phone Number</h4>
                <p className='titleText'>{restaurant.contact_number}</p><br />
                <h4 className='SubTitle'>The Big Chill Cakery</h4>
                <p className='titleText'>{restaurant.address}</p>
              </div>
            </div>
          </div>
          <Modal
            isOpen={menuModalOpen}
            style={customStyles}>
              <div className='menuContainer'>
                <div onClick={() => this.handleModal('menuModalOpen', false)} className='bi bi-x-lg me-3 modal_cross'></div>
                <h2 className='fw-bolder ms-3 mt-3 menuResName'>{restaurant.name}</h2>
                
                <div>
                  {menuItems.map((item, index) => {
                      return(
                          <div className='container overflow-auto mt-4'>
                            <div className='d-inline-block col-9'>
                                <span className='fw-bold ms-1 menuName'>{item.name}</span><br />
                                <span className='ms-1 menuQty'>₹{item.price}</span><br />
                                <p className='ms-1 modal_subtitle'>{item.description}</p>
                            </div>
                            <div className='d-inline-block col-3'>
                              <img src={item.image} className='me-3 modal_image' alt='menuImg' />
                              { item.qty === 0 ? 
                                  <div>
                                      <button className='btn btn-light text-success shadow-sm bg-white rounded add' onClick={() => this.addItems(index, 'add')}>Add</button>
                                  </div> : 
                                  <div className='qty_set btn-group' role="group">
                                      <button className='btn btn-light text-success shadow-sm bg-white' onClick={() => this.addItems(index, 'substract')}> - </button>
                                      <span className='quantity text-success shadow-sm bg-white qty'>{ item.qty }</span>
                                      <button className='btn btn-light text-success shadow-sm bg-white' onClick={() => this.addItems(index, 'add')}> + </button>
                                  </div> }
                            </div>

                            <hr />
                          </div>
                      );
                  })}
                    
                </div>
                <div className='price_box' style={{ backgroundColor: "#F5F8FF"}}>
                  <div className='d-inline-block col-9'>
                      {
                          subtotal ?
                          <h3 className="item-total fw-bolder menuSub">SubTotal : ₹{subtotal}  </h3> :
                          <h3 className="item-total fw-bolder menuSub">SubTotal :</h3>
                      }
                      
                  </div>
                        
                  <div className='d-inline-block col-3'>
                      { subtotal === undefined ? (
                          <button className="btn btn-danger order-button pay menuPay" disabled > Pay Now</button>
                      ):(
                          <button className="btn btn-danger order-button pay menuPay"onClick={() => {
                              this.handleModal('menuModalOpen', false);
                              this.handleModal('formModal', true);
                          }}> Pay Now</button>
                      )}
                      
                  </div>
                        
                </div> 
              </div>   
          </Modal>
          <Modal
            isOpen={galleryModal}
            style={customStyles}
          >
                    <div onClick={() => this.handleModal('galleryModal', false)} className='bi bi-x-lg me-3 modal_cross'></div>
                    
                    <Carousel showThumbs={false} showStatus={false} centerSlidePercentage = {50}>
                      <div>
                          <img src={`${restaurant.thumb}`} className="bannerImg" alt='restaurentFood'/>
                      </div>
                    </Carousel>
                          
          </Modal>
          <Modal
          isOpen = {formModal}
          style={customStyles}>
                <div className='container'>
                  <div className='bi bi-x-lg me-3 modal_cross' onClick={() => this.handleModal('formModal', false)} style={{cursor:'pointer',width: '15px',height: '15px'}}></div>
                  <h1 className='chilltxt container mt-5'>{ restaurant.name }</h1> 
                  <form>
                    <div class="form-group mt-4 ml-1">
                      <label className='mb-2 formtext' for = 'name'>Name</label>
                      <input type='text' placeholder='Enter your name' id='name' class=" formName mb-4" onChange={this.setName} value={this.state.Name}/>
                    </div>
                    <div class="form-group">
                      <label for= 'contact' className='mb-2 formtext'>Mobile Number</label>
                      <input type='tel' placeholder='Enter mobile number' id='contact' class=" formName mb-4" onChange={this.setNumber} value={this.state.MobileNumber}/>
                    </div>
                    <div class="form-group">
                      <label for = 'address' className='mb-2 formtext'>Address</label>
                      <textarea className='formAddr mb-4' placeholder='Enter your address' id='address' onChange={this.setAddress} value={this.state.Address}></textarea>
                    </div>
                  </form>
                  <div>
                      <button className='formBtn mt-5' 
                      onClick={this.handleButtonClick.bind(this)}
                      >
                        PROCEED
                      </button>
                  </div>
                </div>
                
          </Modal>
          {/*<Modal isOpen ={orderModal} style={customStyles}> 
            <div className='order'>
              <h1 className='Sumarry'>Order Sumarry</h1>
              <h1 className='Greet'>Super! Your prder has beem confirmed</h1>
              <div className='orderContent'>
                <p>It will be deliverd between <br />08:00 PM and 09:00 <br /> PM on date</p>
              </div>
              <button>Continue </button>
              <div className='OrderContact'>
                <h1 className='ContactTitle'>Contact Zomato</h1>
                <span>Contact : <p className='support'>+91 1195658455</p></span>
                <span>Email : <p className='support'>zomato@support.com</p></span>
              </div>
            </div>
          </Modal>*/}
      </div>
    )
  }
}

export default Details;
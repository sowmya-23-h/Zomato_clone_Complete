import React from 'react';
import './Style/Header.css';
import Modal from "react-modal";
import axios from "axios";
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

class Header extends React.Component {
    constructor() {
        super();

        this.state = {
            loginModal: false,
            registrationModal: false,
            email: undefined,
            password: undefined,
            name: undefined,
            users: undefined,
            User: '',
            message: '',
            atlasUser: false
        }
    }
    handleModal = (state, value) => {
        this.setState({ [state]: value })
    }

    google = () => {
        window.open("http://localhost:5502/auth/google", "_self");
    };

    logout = () => {
        window.open("http://localhost:5502/auth/logout", "_self");
    };

    // Insert to Name
    setName = (i) => {
        this.setState({ name: i.target.value });
    }

    // Insert to Mail
    setMail = (i) => {
        this.setState({ email: i.target.value });
    }

    // Insert to Password
    setPassword = (i) => {
        this.setState({ password: i.target.value });
    }

    // Registration details
    registration = () => {
        const { email, password, name } = this.state;

        const regObj = {
            email: email,
            password: password,
            name: name
        }

        axios({
            url: 'http://localhost:5502/signup',
            method: 'POST',
            headers: { 'Content-Type': 'application/JSON' },
            data: regObj
        })
            .then(res => {
                this.setState({ users: res.data.userDetails })
            })
            .catch(err => console.log(err))
    }

    handleLogin = () => {
        const { email, password } = this.state;

        fetch('http://localhost:5502/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())

            .then((data) => {
                console.log(data)
                if (data.Authentication) {
                    // Login was successful, store user data
                    this.setState({ User: data.userDetails, message: 'Login successful' });
                    this.setState({ atlasUser: true })
                } else {
                    // Login failed, handle the error
                    this.setState({ message: 'Login failed' });
                }
            })
            .catch((error) => {
                this.setState({ message: 'Login error' });
            });
    };
    afterLogin = () => {
        this.handleLogin();
        this.handleModal('loginModal', false)
    }
    render() {
        const { loginModal, registrationModal, User, atlasUser } = this.state;
        const { user } = this.props;
        return (
            <div>
                {
                    atlasUser ? (
                        <div>
                            {User ? (
                                // Display user data
                                <div className='atlasContainer'>
                                    <form className="d-flex mt-2">
                                        <img className='atlesUserImage' src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-vector-users-icon-png-image_3762775.jpg" alt='userImage' />
                                        <p className='accountName'>{User[0].name}</p>
                                        {console.log(User)}
                                        <button type="button" className="accountLogOut" onClick={this.logout}>
                                            Logout
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                // Display login options
                                <div className="container">
                                    <div className="position-absolute float-end" style={{ marginLeft: "50em" }}>
                                        <form className="d-flex mt-3">
                                            <button type="button" className="btn btn-link text-light account" onClick={() => {
                                                this.handleModal('loginModal', true);
                                            }} style={{ textDecoration: "none" }}>Login</button>
                                            <button type="button" className="btn btn-outline-light account" onClick={() => {
                                                this.handleModal('registrationModal', true);
                                            }}>Create an account</button>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="position-absolute float-end" style={{ marginLeft: "50em" }}>
                            {!user ? (
                                <form className="d-flex mt-3 googleContainer">
                                    <button type="button" className="btn btn-link text-light account" onClick={() => {
                                        this.handleModal('loginModal', true);
                                    }}
                                        style={{ textDecoration: "none" }}>Login</button>
                                    <button type="button" className="btn btn-outline-light account" onClick={() => {
                                        this.handleModal('registrationModal', true);
                                    }}>Create an account</button>
                                </form>
                            ) : (
                                <form className="d-flex mt-2 googleContainer">

                                    <img className='img-fluid img-thumbnail circle' src={user.photos[0].value} alt='userImage' />
                                    <p className='text-light fw-3 fs-5 mx-3 pt-2 GoogleName'>{user.displayName}</p>
                                    <button type="button" className="btn btn-outline-light px-3 account" onClick={this.logout}>Logout</button>

                                </form>
                            )}
                        </div>
                    )
                }




                {/* Login Page */}
                <Modal
                    isOpen={loginModal}
                    style={customStyles}
                >
                    <div onClick={() => this.handleModal('loginModal', false)} className='bi bi-x-lg me-3 modal_cross'></div>
                    <h2 className='fw-bolder ms-3 mt-3 LoginPage'> Login </h2>

                    <div class="form-group mt-4">
                        <label className='mb-2 formtext' for="name">Email</label>
                        <input type="text"
                            class="form-control formsName"
                            id="name" placeholder="Enter your email ID"
                            value={this.state.email}
                            onChange={(e) => this.setState({ email: e.target.value })}
                            style={{ borderRadius: '0px' }} />
                    </div>

                    <div class="form-group mt-4">
                        <label className='mb-2 formtext' for="password">Password</label>
                        <input type="password"
                            class="form-control formsName"
                            id="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={(e) => this.setState({ password: e.target.value })}
                            style={{ borderRadius: '0px' }} />
                    </div>

                    <div className='login_box account' style={{ backgroundColor: "#F5F8FF" }}>
                        <button type='button'
                            className="btn btn-danger"
                            style={{ float: 'right', marginTop: '20px' }}
                            onClick={this.afterLogin}
                        > Login </button>
                    </div>
                    <span className='lineOr'>
                    <hr className='loginLine' /> OR
                    </span>
                    <div>
                        <img src='https://img.icons8.com/?size=256&id=37246&format=png' className='logo_google' alt='Google Logo' />
                        <button type='button' className='btn btn-outline-primary btn-lg ps-5 m-5 loginGoggle' onClick={this.google}>Login with Google</button>
                    </div>

                    <div className='noAccount'>Don’t have account? <span onClick={() => { this.handleModal('registrationModal', true); this.handleModal('loginModal', false) }}> Sign UP </span></div>
                </Modal>

                {/* Registration Page */}
                <Modal
                    isOpen={registrationModal}
                    style={customStyles}
                >
                    <div onClick={() => this.handleModal('registrationModal', false)} className='bi bi-x-lg me-3 modal_cross'></div>
                    <h2 className='fw-bolder ms-3 mt-3 LoginPage'> Sign Up </h2>

                    <div style={{ "width": "28em" }} className='px-3'>

                        <form onSubmit={this.registration}>

                            <div class="form-group mt-4">
                                <label className='mb-2 formtext' for="name">Name</label>
                                <input type="text" class="form-control formsName" id="name" placeholder="Enter your name" onChange={this.setName} value={this.state.name} style={{ borderRadius: '0px' }} />
                            </div>

                            <div class="form-group mt-4">
                                <label className='mb-2 formtext' for="email">Email Id</label>
                                <input type="email" class="form-control formsName" id="email" placeholder="Enter Email Id" onChange={this.setMail} value={this.state.email} style={{ borderRadius: '0px' }} />
                            </div>

                            <div class="form-group mt-4">
                                <label className='mb-2 formtext' for="password">Password</label>
                                <input type="password" class="form-control formsName" id="password" placeholder="Enter Password" onChange={this.setPassword} value={this.state.password} style={{ borderRadius: '0px' }} />
                            </div>

                            <div className='next_box account' style={{ backgroundColor: "#F5F8FF" }}>
                                <button type='submit' value='submit' className="btn btn-danger" style={{ float: 'right', marginTop: '20px' }} > Sign Up </button>
                            </div>

                            <div className='noAccount'>Already have an account?
                                <span onClick={() => {
                                    this.handleModal('loginModal', true);
                                    this.handleModal('registrationModal', false)
                                }}> Login
                                </span>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default Header;
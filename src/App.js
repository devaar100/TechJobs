import React, { Component, useState } from "react";
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import EditProfile from "./components/edit-profile.component";
import ProfileList from "./components/profile-list.component";
import logo from './images/logo.jpeg';
import banner from './images/banner.png'
import fire from "./fire";
import { login, logout } from "./components/login-component";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    fire.auth().onAuthStateChanged((user) => {
        return user ? setIsLoggedIn(true) : setIsLoggedIn(false);
    });

    return (
        <Router>
            <div className="w-100 h-100">
                {!isLoggedIn
                    ? (
                        <div className="w-100 h-100 d-flex" style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={banner} height="400"/>
                            <span style={{fontSize: 25, fontWeight: 'bold', marginTop: 20, marginBottom: 20}}>Get referrals for your dream jobs</span>
                            <button className="btn btn-primary" onClick={() => login()}>Login with Google</button>
                        </div>
                    )
                    : (
                        <>
                            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                                <a className="navbar-brand" href="https://codingthesmartway.com" target="_blank">
                                    <img src={logo} style={{borderRadius: 5}} width="30" height="30" alt="CodingTheSmartWay.com"/>
                                </a>
                                <Link to="/" className="navbar-brand">TechJobs</Link>
                                <div className="collpase navbar-collapse justify-content-end">
                                    <ul className="navbar-nav">
                                        <li className="navbar-item">
                                            <Link to="/profile" className="nav-link">
                                                <img src={fire.auth().currentUser.photoURL} style={{borderRadius: 15}} width="30" height="30" alt="CodingTheSmartWay.com"/>
                                            </Link>
                                        </li>
                                        <li className="navbar-item">
                                            <Link to="/profile" className="nav-link">Profile</Link>
                                        </li>
                                        <li className="navbar-item" onClick={() => logout()}>
                                            <Link to="/" className="nav-link">Logout</Link>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                            <br/>
                            <Route path="/" exact component={ProfileList} />
                            <Route path="/profile" component={EditProfile} />
                        </>
                    )}
            </div>
        </Router>
    );
}

export default App;

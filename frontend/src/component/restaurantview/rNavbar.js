import React, { Component } from 'react';
import '../restaurantview/rNavbar.css'
import { MenuItems } from "./rNavbarMenu"
import cookie from 'react-cookies';



class rNavbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }


    render() {
        return (
            <nav className="NavbarItems">
                <h1 className="navbar-logo">Yelp<i className="fab fa-react"></i></h1>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    {MenuItems.map((item, index) => {
                        return (
                            <li key={index}>
                                <a className={item.cName} href={item.url}>
                                    {item.title}
                                </a>
                            </li>
                        )
                    })}
                </ul>

            </nav>
        )
    }
}

export default rNavbar
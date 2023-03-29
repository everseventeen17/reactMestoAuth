import logo from '../images/header/logo.svg';
import React from 'react';
import {Link} from 'react-router-dom';

function Header({route, email, onClick, title }) {

    return (
        <header className="header">
            <img src={logo} alt="Место Россия" className="header__logo"/>

            <nav className="header__authentication">
                <p className="header__user-email">{email}</p>
                <Link to={route} className="header__link" type="button" onClick={onClick}>
                    {title}
                </Link>
            </nav>

        </header>
    )
}

export default Header;
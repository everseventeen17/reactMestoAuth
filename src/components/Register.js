import React from 'react';
import {Link} from 'react-router-dom';

export const Register = () => {
    return (
        <div className="authentication">
            <h2 className="authentication__title">Регистрация</h2>
            <form className="authentication__form authentication__form_registration"
            name="registration" method="post">

                <input className="authentication__input-text authentication__input-text_email" name="email" placeholder="Email"></input>
                <span className="authentication__error authentication__error_email">11</span>

                <input className="authentication__input-text authentication__input-text_password" name="password" placeholder="Пароль"></input>
                <span className="authentication__error authentication__error_password">11</span>

                <button className="authentication__submit-btn">Зарегистрироваться</button>
                <Link className="authentication__caption" to="/sign-in">
                    Уже зарегистрированы? Войти
                </Link>
            </form>
        </div>
    );
};
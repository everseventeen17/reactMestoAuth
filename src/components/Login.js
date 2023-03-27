import React from 'react';

export const Login = () => {
    return (
        <div className="authentication">
            <h2 className="authentication__title">Вход</h2>
            <form className="authentication__form authentication__form_registration"
                  name="registration" method="post">

                <input
                    className="authentication__input-text authentication__input-text_email"
                    placeholder="Email" name="email"></input>
                <span className="authentication__error authentication__error_email">11</span>

                <input
                    className="authentication__input-text authentication__input-text_password"
                    placeholder="Пароль" name="password" ></input>
                <span className="authentication__error authentication__error_password">11</span>

                <button className="authentication__submit-btn">Войти</button>
            </form>
        </div>
    );
};

import React from 'react';
import {Link} from 'react-router-dom';

export function Register (props) {
    const [password, setPassword] = React.useState('');
    const [email, setEmail] = React.useState('');


    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleChangeEmail(e) {
        setEmail(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.onRegister({email, password});
    }
    return (
        <div className="authentication">
            <h2 className="authentication__title">Регистрация</h2>
            <form className="authentication__form authentication__form_registration"
            name="registration" method="post" onSubmit={handleSubmit}>

                <input className="authentication__input-text authentication__input-text_email"
                       onChange={handleChangeEmail} name="email" placeholder="Email" required></input>
                <span className="authentication__error authentication__error_email">11</span>

                <input className="authentication__input-text authentication__input-text_password" autoComplete="off"
                       onChange={handleChangePassword} name="password" type="password" placeholder="Пароль" required></input>
                <span className="authentication__error authentication__error_password">11</span>

                <button className="authentication__submit-btn">Зарегистрироваться</button>

                <Link className="authentication__caption" to="/sign-in">
                    Уже зарегистрированы? Войти
                </Link>
            </form>
        </div>
    );
};
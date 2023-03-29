import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';

import {Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import {Login} from './Login';
import {Register} from './Register';
import {ProtectedRoute} from "./ProtectedRoute";
import {InfoTooltip} from "./InfoTooltip";
import successImg from "../images/popup/success.svg";
import failureImg from "../images/popup/failure.svg";

import {api} from '../utils/Api';
import {CurrentUserContext} from '../contexsts/CurrentUserContext';
import {auth} from "../utils/UserApi";

function App() {

    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);


    const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
    const [infoTooltipImage, setInfoTooltipImage] = React.useState("");
    const [popupTitle, setPopupTitle] = React.useState("");

    const [selectedCard, setIsSelectedCard] = React.useState({name: '', link: ''});
    const [cards, setIsCards] = React.useState([]);
    const [cardId, setIsCardId] = React.useState('');


    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [emailName, setEmailName] = React.useState(null);

    const [currentUser, setCurrentUser] = React.useState({
        name: '',
        about: '',
        avatar: '',
    });

    const isOpen = isInfoTooltipPopupOpen || isEditAvatarPopupOpen || isConfirmPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link


    function handleEditProfilePopupOpen() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlacePopupOpen() {
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarPopupOpen() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleConfirmPopupOpen(card) {
        setIsConfirmPopupOpen(true)
        setIsCardId(card._id)
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setIsConfirmPopupOpen(false)
        setIsSelectedCard({name: '', link: ''});
        setIsInfoTooltipPopupOpen(false);
    }

    function handleCardClick(card) {
        setIsSelectedCard(card)
    }

    React.useEffect(() => {
        function closeByEscape(evt) {
            if (evt.key === 'Escape') {
                closeAllPopups();
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', closeByEscape);
            return () => {
                document.removeEventListener('keydown', closeByEscape);
            }
        }
    }, [isOpen])


    React.useEffect(() => {
        if (isAuthorized === true) {
            api.getProfileData()
                .then(res => {
                    setCurrentUser(res);
                })
                .catch(err => console.log(err));
        }

    }, [isAuthorized]);

    React.useEffect(() => {
        if (isAuthorized === true) {
            api.getInitialCards()
                .then((data) => {
                    setIsCards(data);

                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [isAuthorized])

    function handleCardLike(card) {
        const isLiked = card.likes.some(item => item._id === currentUser._id);
        api.changeLikeCardStatus(card._id, isLiked)
            .then((res) => {
                setIsCards((state) => state.map((item) => item._id === card._id ? res : item));
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleCardDelete() {
        api.deleteCard(cardId)
            .then((res) => {
                setIsCards(cards.filter(item => item._id === cardId ? null : item));
                closeAllPopups();
            })
            .catch(err => {
                console.log(err);
            });
    }

    function handleUpdateUser({name, about}) {
        api.patchProfileData({name, about})
            .then(res => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function handleUpdateAvatar(avatar) {
        api.patchAvatar(avatar)
            .then(res => {
                setCurrentUser(res);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function handleAddPlaceSubmit({name, link}) {
        api.postNewCard({name, link})
            .then(res => {
                setIsCards([res, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function handleInfoTooltip() {
        setIsInfoTooltipPopupOpen(true);
    }

    function onRegister({email, password}) {
        auth.postRegister({email, password})
            .then(() => {
                setInfoTooltipImage(successImg);
                setPopupTitle("Вы успешно зарегистрировались!");
                navigate("/sign-in");
            }).catch(() => {
            setInfoTooltipImage(failureImg);
            setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
        }).finally(
            handleInfoTooltip
        );
    }

    function onLogin({email, password}) {
        auth.postAuth({email, password})
            .then((data) => {
                localStorage.setItem("jwt", data.token);
                setIsAuthorized(true);
                setEmailName(email);
                navigate("/");
            }).catch(() => {
            setInfoTooltipImage(failureImg);
            setPopupTitle("Что-то пошло не так! Попробуйте ещё раз.");
            handleInfoTooltip();

        });
    }


    React.useEffect(() => {
        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            auth.getToken(jwt)
                .then((data) => {
                    if (data) {
                        setIsAuthorized(true);
                        setEmailName(data.data.email);
                    }
                }).catch((err) => {
                console.error(err);
            });
        }
    }, []);

    React.useEffect(() => {
        if (isAuthorized === true) {
            navigate("/");
        }
    }, [isAuthorized, navigate]);

    function onSignOut() {
        setIsAuthorized(false);
        setEmailName(null);
        navigate("/sign-in");
        localStorage.removeItem("jwt");
    }

    return (

        <CurrentUserContext.Provider value={currentUser}>

            <Routes>
                <Route path="/sign-in" element={
                    <>
                        <Header title="Регистрация" route="/sign-up"/>
                        <Login onLogin={onLogin}/>
                    </>
                }/>

                <Route path="/sign-up" element={
                    <>
                        <Header title="Войти" route="/sign-in"/>
                        <Register onRegister={onRegister}/>
                    </>
                }/>

                <Route exact path="/" element={
                    <>
                        <Header title="Выйти" mail={emailName} onClick={onSignOut}/>
                        <ProtectedRoute
                            element={Main}
                            isAuthorized={isAuthorized}
                            onEditProfile={handleEditProfilePopupOpen}
                            onAddPlace={handleAddPlacePopupOpen}
                            onEditAvatar={handleEditAvatarPopupOpen}
                            onCardClick={handleCardClick}
                            cards={cards}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                        <Footer/>
                    </>
                }/>

                <Route path="/" element={<Navigate to={isAuthorized ? "/" : "/sign-in"}/>}/>
            </Routes>

            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onUpdateUser={handleUpdateUser}
            />

            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar}
            />

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onAddPlace={handleAddPlaceSubmit}
            />

            <ConfirmPopup
                isOpen={isConfirmPopupOpen}
                onClose={closeAllPopups}
                onDeleteCard={handleCardDelete}
            />


            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
            />

            <InfoTooltip
                image={infoTooltipImage}
                title={popupTitle}
                isOpen={isInfoTooltipPopupOpen}
                onClose={closeAllPopups}
            />

        </CurrentUserContext.Provider>
    );
}

export default App;

import React from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import EditProfilePopup from './EditProfilePopup';
import ImagePopup from './ImagePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';

import { api } from '../utils/Api';
import { CurrentUserContext } from '../contexsts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);

  const [selectedCard, setIsSelectedCard] = React.useState({ name: '', link: '' });
  const [cards, setIsCards] = React.useState([]);
  const [cardId, setIsCardId] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});

  const isOpen = isEditAvatarPopupOpen || isConfirmPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link


  function handleEditProfilePopupOpen() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlacePopupOpen() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarPopupOpen() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleConfirmPopupOpen(card){
    setIsConfirmPopupOpen(true)
    setIsCardId(card._id)
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false)
    setIsSelectedCard({ name: '', link: '' })
  }

  function handleCardClick(card) {
    setIsSelectedCard(card)
  }

  React.useEffect(() => {
    function closeByEscape(evt) {
      if(evt.key === 'Escape') {
        closeAllPopups();
      }
    }
    if(isOpen) { // навешиваем только при открытии
      document.addEventListener('keydown', closeByEscape);
      return () => {
        document.removeEventListener('keydown', closeByEscape);
      }
    }
  }, [isOpen])

  React.useEffect(() => {
    api.getProfileData()
      .then(res => {
        setCurrentUser(res);
      })
      .catch(err => console.log(err));
  }, []);

  React.useEffect(() => {
    api.getInitialCards()
      .then((data) => {
        setIsCards(data);
        
      })
      .catch((err) => {
        console.log(err);
      })
  }, [])

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

  function handleUpdateUser({ name, about }) {
    api.patchProfileData({ name, about })
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

  function handleAddPlaceSubmit({ name, link }) {
    api.postNewCard({ name, link })
      .then(res => {
        setIsCards([res, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err)
      });
  }

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <Header />
        <Main
          onEditProfile={handleEditProfilePopupOpen}
          onAddPlace={handleAddPlacePopupOpen}
          onEditAvatar={handleEditAvatarPopupOpen}
          onCardClick={handleCardClick}

          onCardLike={handleCardLike}
          onCardDelete={handleConfirmPopupOpen}
          cards={cards}
        />
        <Footer />


        {/* <!-- PROFILE modal window --> */}
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        {/* <!-- AVATAR modal window --> */}
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        {/* <!-- PLACE modal window --> */}
          <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          />

        {/* <!-- CONFIRM modal window --> */}
        <ConfirmPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onDeleteCard={handleCardDelete}
        />

        {/* <!-- PHOTO modal window --> */}
        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />
      </CurrentUserContext.Provider>
  );
}

export default App;

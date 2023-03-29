
const apiUserData = {
    link: 'https://auth.nomoreparties.co/',
    headers: {
        'Content-Type': 'application/json'
    }
}

 class UserApi {
     constructor(apiUserData) { // принимает объект с ссылкой и токеном
         this._link = apiUserData.link; // ссылка идентификатор группы cohort-59
         this._headers = apiUserData.headers; // headers
     }

     _checkResponse(res) {
         if (res.ok) {
             return res.json();
         } else {
             return Promise.reject(`Ошибка ${res.status}`);
         }
     }


     postRegister({email, password}) {
         return fetch(`${this._link}signup`, {
             headers: this._headers,
             method: 'POST',
             body: JSON.stringify({email, password})
         })
             .then(this._checkResponse)
     };


     postAuth({email, password}) {
         return fetch(`${this._link}signin`, {
             headers: this._headers,
             method: 'POST',
             body: JSON.stringify({email, password})
         })
             .then(this._checkResponse)
     };

     getToken(jwtToken) {
         return fetch(`${this._link}users/me`, {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                 Authorization: `Bearer ${jwtToken}`,
             },
         }).then(this._checkResponse);

     }
 }

export const auth = new UserApi(apiUserData);
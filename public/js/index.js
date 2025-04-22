/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable */
import '@babel/polyfill'
import { displayMap } from './mapbox';
import {login,logout} from './login';
import { signup } from './signup';
// import { updateData } from './updateSettings';
import { updateSettings } from './updateSettings';

import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBTN = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const bookButton = document.getElementById('book-tour');



// DELEGATION
if(mapBox){
    const locations = JSON.parse(mapBox.dataset.locations);
    console.log(locations);
    displayMap(locations);
}


if(signupForm){
    signupForm.addEventListener('submit',e=>{
        e.preventDefault();
        //VALUES
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordconfirm').value;
        console.log(name,email,password,passwordConfirm);
        signup(name,email,password,passwordConfirm);
    });
}


if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        //VALUES
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log(email,password);
        login(email,password);
    });
}


if(logOutBTN) logOutBTN.addEventListener('click',logout);

if(userDataForm){
    userDataForm.addEventListener('submit',e=>{
        e.preventDefault();

        const form = new FormData();

        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);
        form.append('photo',document.getElementById('photo').files[0]);

        console.log(form);


        // by using API
        // const name = document.getElementById('name',).value;
        // const email = document.getElementById('email').value;

        updateSettings(form,'data');
    });
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();

        document.querySelector('.btn--save-password').textContent= 'Updating...';

        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;

        await updateSettings({passwordCurrent,password,passwordConfirm},'password');

        document.querySelector('.btn--save-password').textContent   = 'Save Password';
        document.getElementById('password-current').value = "";
        document.getElementById('password').value = "";
        document.getElementById('password-confirm').value = "";

    });
};

if(bookButton){
    bookButton.addEventListener('click',e=>{
        e.target.textContent = 'Processing...';
        const tourId = e.target.dataset.tourId;
        bookTour(tourId)
    })
}

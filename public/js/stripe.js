/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */

import axios from "axios";
import { loadStripe } from '@stripe/stripe-js';
 
const stripePromise = loadStripe('pk_test_51RGYrDCyO5j6Yi7ijIWjR0xYji03G8gZu4GdJXLWIglUIhOamuLuGzqG5JHrEO027dD3sBrkXmvFK7vsl3Dl7Jzu00Ye0s0f6D');
 
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);
 
    // 2) Load Stripe object
    const stripe = await stripePromise;
 
    // 3) Redirect to Stripe checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.error('Booking error:', err);
    alert('Something went wrong while booking the tour!');
  }
};





// import axios from "axios";

// const stripe = Stripe('pk_test_51RGYrDCyO5j6Yi7ijIWjR0xYji03G8gZu4GdJXLWIglUIhOamuLuGzqG5JHrEO027dD3sBrkXmvFK7vsl3Dl7Jzu00Ye0s0f6D');

// export const bookTour= async tourId =>{
//     // 1] get checkout session from endpoint(API)
//     const session = await axios(
//         `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
//     );

//     console.log(session);


//     // 2] Create checkout form + charge credit card

// }
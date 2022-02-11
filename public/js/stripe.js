/* eslint-disable */
import axios from "axios";
import {showAlert} from "./alerts";

const stripe = Stripe('stripe_public_key');

export const bookTour = async tourId => {
  try {
    // 1) Get session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }

}
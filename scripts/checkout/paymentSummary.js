/*
  Main idea of JavaScript
  1. Save the data (Model)
  2. Generate the HTML (View)
  3. Make it interactive (Controller)
*/

/* 
  Steps:-
  1. Loop through the cart
  2. For each product,
    price * quantity
  3. Add everything together
  
  first get the product id 
*/

/*
  To calculate the shipping cost
  1. loop through the cart
  2. Add all the shipping costs together
  3. we need to use deliveryOptionId
*/

import {cart, calculateCartQuantity, placeOrder} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js'


export function renderPaymentSummary(){

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
     const product = getProduct(cartItem.productId);
     productPriceCents += product.priceCents * cartItem.quantity;

     const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
     shippingPriceCents += deliveryOption.priceCents 
  });

  // console.log(productPriceCents);
  // console.log(shippingPriceCents);

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

  // to calculate tax 10% = multiply by 10 per/100 cent o/p= 10/100 = 0.1

  const taxCents = totalBeforeTaxCents * 0.1;

  const totalCents = totalBeforeTaxCents + taxCents;

  const cartQuantity = calculateCartQuantity();

  const paymentSummaryHTML = `

        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>
          items (${cartQuantity}):
          </div>
          <div class="payment-summary-money">
          $${formatCurrency(productPriceCents)}
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">
          $${formatCurrency(shippingPriceCents)}
          </div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">
          $${formatCurrency(totalBeforeTaxCents)}
          </div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">
          $${formatCurrency(taxCents)}
          </div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">
          $${formatCurrency(totalCents)}
          </div>
        </div>

        <button class="place-order-button button-primary js-place-order-btn">
          Place your order
        </button>

  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // ✅ Add Event Listener after Button is Injected
  document.querySelector(".js-place-order-btn")
  .addEventListener('click', () => {
    console.log('Button clicked!');
    placeOrder(cart); // ✅ Pass the cart to the function
  });
}









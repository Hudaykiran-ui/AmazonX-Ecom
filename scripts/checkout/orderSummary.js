/*
  Main idea of JavaScript
  1. Save the data (Model)
  2. Generate the HTML
  3. Make it interactive
*/

import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOptions
} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

/*=====================================  the below code is for generating delivery dates code using external library  dayjs() ======================================== */

// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate.format('dddd, MMMM, D'));

// console.log(deliveryDate)

export function renderOrderSummary(){

 /*=================================================  the below code is for generating html code using javascript ==================================================== */

  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    
    //old direct method
    // const today = dayjs();
    // const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    // const dateString = deliveryDate.format('dddd, MMMM, D');

    // new method using function 
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img  class="product-image" src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>

                <div class="product-price">
                  ${matchingProduct.getPrice()}
                </div>

                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>

                  <span class="update-quantity-link link-primary js-update-link"  data-product-id="${matchingProduct.id}" >
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>

                  <span class="delete-quantity-link link-primary js-delete-link 
                    js-delete-link-${matchingProduct.id}" 
                    data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                  ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>
    `;

  });

  
  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  /*====================================  the below code is for generating delivery dates code using external library  dayjs() ======================================= */

  function deliveryOptionsHTML(matchingProduct, cartItem){

    let html = '';

    deliveryOptions.forEach((deliveryOption) => {

      // old direct method
      // const today = dayjs();
      // const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      // const dateString = deliveryDate.format('dddd, MMMM, D');

      // new method using function 
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      
      html += `

        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
        </div>
      `;
    });

    return html;
  }

  /*========================================================= adding functionality to delete button in cart ========================================================== */

  document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId
      removeFromCart(productId);

      // const container = document.querySelector(`.js-cart-item-container-${productId}`);

      // container.remove();


      renderCheckoutHeader();

      renderOrderSummary();

      // updateCartQuantity();

      renderPaymentSummary();
    });
  });

  /*=========================================================  updating cart quantity in checkout header  ============================================================ */

 function updateCartQuantity() {

    //this calculateCartQuantity() is from cart.js file
    const cartQuantity = calculateCartQuantity();

    // this line belongs to checkout(items) of header cart '.js-return-to-home-link' 
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;

    renderPaymentSummary();
  }

  /*=============================================== updating checkout header cart quantity when page reloads ==========================================================*/

  updateCartQuantity();

  /*============================================================ updating update button in checkout page ==============================================================*/

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      // Get the cart item container
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (!container) {
        console.error(`Container for product ${productId} not found.`);
        return;
      }

      // Toggle editing mode
      container.classList.add('is-editing-quantity');
    });
  });

  // Handle save button click (to update quantity)
  document.querySelectorAll('.js-save-link').forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;

      // Get the cart item container
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (!container) {
        console.error(`Container for product ${productId} not found.`);
        return;
      }

      // Get input field
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      if (!quantityInput) {
        console.error(`Quantity input for product ${productId} not found.`);
        return;
      }

      // Convert input value to number
      let newQuantity = Number(quantityInput.value);
      if (isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      }

      console.log(`Updating Product ${productId} to Quantity:`, newQuantity);

      // Update the cart quantity
      updateQuantity(productId, newQuantity);

      // Hide input and show updated quantity
      container.classList.remove('is-editing-quantity');

      // Update the quantity label
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      if (quantityLabel) {
        quantityLabel.innerHTML = newQuantity;
      }

      updateCartQuantity();
    });
  });

  /*============================================================ updating delivery options in checkout page =============================================================*/

  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} =element.dataset;
        updateDeliveryOptions(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}





  


import { generateOrderId } from "./deliveryOptions.js";
/*============================================================== updating the cart to local storage ================================================================= */

import { getDeliveryOption } from "./deliveryOptions.js";
import { getProduct } from "./products.js";
import { calculateDeliveryDate } from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {
    cart = [{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity:2,
      deliveryOptionId: '1'
    }, {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity:1, 
      deliveryOptionId: '2'
    }];
  }
}


export function saveToStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

/*========================================================= function from amazon.js file add to cart from ============================================================ */


export function addToCart(productId){
  let matchingCartItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingCartItem = cartItem;
    }
  });
  
  const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);

  if (!quantitySelector) {
    console.error(`Error: No quantity selector found for productId ${productId}`);
    return; // Stop execution if the element is missing
  }
  
  const quantity = Number(quantitySelector.value);

  if(matchingCartItem){
    matchingCartItem.quantity += quantity;
  }else{
    cart.push({
      productId: productId,
      quantity: quantity,
      deliveryOptionId: '1'
    });
  }

  // Reset quantity selector to minimum value (1)
  quantitySelector.value = 1; 

  saveToStorage();
}


/*====================================================================== product removeFromCart ====================================================================== */

export function removeFromCart(productId){

  const newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  });

  cart = newCart;

  saveToStorage();

}

/*====================================================================== calculate Cart Quantity ===================================================================== */

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

/*=============================================================== function updateQuantity in checkout ================================================================ */

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}

/*=========================================================== function updateDelivery options in checkout ============================================================ */

export function updateDeliveryOptions(productId, deliveryOptionId) {

  let matchingCartItem;

  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingCartItem = cartItem;
    }
  });

  matchingCartItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

/*=========================================================== function for placeOrder in checkout page =============================================================== */

export function placeOrder(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    console.warn("Cannot place an empty order.");
    return;
  }

  let totalAmount = 0;

  const processedItems = cartItems.map((item) => {

    const product = getProduct(item.productId) || {};
    const deliveryOption = getDeliveryOption(item.deliveryOptionId) || {};

    const productPrice = product.priceCents ? Number(product.priceCents) : 0;
    const shippingPrice = deliveryOption.priceCents ? Number(deliveryOption.priceCents) : 0;

    const estimatedTax = Math.round((productPrice + shippingPrice) * 0.1);

    totalAmount += (productPrice * item.quantity) + shippingPrice + estimatedTax;

    // ✅ Store delivery date inside each item
    // here we used The spread operator (...) takes all the properties of an object and copies them into a new object.

    return {
      ...item,
      deliveryDate: calculateDeliveryDate(deliveryOption) // ✅ Store estimated delivery date
    };

  });


  // Retrieve existing orders from localStorage or initialize an empty array
  const savedOrders = JSON.parse(localStorage.getItem("orderDetails")) || [];

  // Create a new order object with a unique ID, current date, and items
  const newOrder = {
    orderId: `ORDER-${savedOrders.length + 1000}`, // Unique Order ID
    date: new Date().toISOString(), // Order Date
    items: processedItems, // Store cart items inside the order
    totalAmount
  };

  // Add the new order to the list of saved orders
  savedOrders.push(newOrder);

  // Save the updated orders back to localStorage
  localStorage.setItem("orderDetails", JSON.stringify(savedOrders));

  console.log("Saved Orders:", savedOrders); // ✅ Logs updated orders

  // Clear cart
  localStorage.removeItem("cart");
  cart = [];
  saveToStorage();
  
  // Redirect user to the orders page
   window.location.href = "orders.html"; // Redirect after storing the order
}


export function updateCartHeaderQuantity(){

  const cartQuantity = calculateCartQuantity();

  document.querySelector('.js-cart-quantity')
  .innerHTML = cartQuantity;
}













import { updateCartHeaderQuantity } from "../data/cart.js";
import { getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



function loadOrderDetails(){

  const ordersContainer = document.querySelector(".js-orders-container");

  const savedOrders = JSON.parse(localStorage.getItem('orderDetails')) || [];


  if (!Array.isArray(savedOrders) || savedOrders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders found.</p>";
    return;
  }

  let ordersHeaderHTML =  '';

  savedOrders.forEach((order) => {

    const formattedDate = new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).replace(',', '');

    let orderItemsHTMl = '';

    /*
    //here "order" contains details such as date, totalAmount, orderId, and items.

    // here "items" contains details:-
      from savedOrders were are getting items...
      productId → The unique ID of the product (used to fetch product details).
      quantity → The number of units purchased for this product.
      deliveryDate → (Optional) Estimated delivery date for this product.
    */

    order.items.forEach((orderItem) => {

      const product = getProduct(orderItem.productId);

      const formattedDeliveryDate = orderItem.deliveryDate
      ? dayjs(orderItem.deliveryDate).format("MMMM D") // Example: March 15
      : "Delivery date not available";
    
      const dateString = `${formattedDeliveryDate}`;

      orderItemsHTMl += `
       <div class="order-details-grid">
            <div class="product-image-container">
              <img src=${product.image}>
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dateString}
              </div>
              <div class="product-quantity">
                Quantity: ${orderItem.quantity}
              </div>
              <button class="buy-again-button button-primary js-buy-again" data-product-id="${orderItem.productId}">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary js-track-page">
                  Track package
                </button>
              </a>
            </div>
          </div>
        </div>
      `;

    });


    ordersHeaderHTML += `
    <div class="order-container">
          
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formattedDate}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalAmount)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId}</div>
          </div>
        </div>
        ${orderItemsHTMl}
    </div>
    `; 
  });


  ordersContainer.innerHTML = ordersHeaderHTML;

  document.querySelectorAll(".js-track-page")
  .forEach(button => {
    button.addEventListener("click", (event) => {
      // Ensure the closest container is found
      const productContainer = event.target.closest(".order-details-grid");
  
      // Get the product ID from the "Buy Again" button inside the same product container
      const buyAgainButton = productContainer.querySelector(".js-buy-again");
    
      const productId = buyAgainButton.dataset.productId;
  
      // Store product ID in localStorage
      localStorage.setItem("trackingProductId", productId);
  
      // Redirect to tracking page
      window.location.href = "tracking.html";
    });
  });
  
}

 function clearOrderData() {
  const clearButton = document.querySelector('.js-clear-orders');

    clearButton.addEventListener('click', () => {
      console.log('Clear Orders button clicked!');
      
      localStorage.removeItem("orderDetails"); // ✅ Clears only order details

      location.reload(); // ✅ Refresh the page to update the UI
    });
}


document.addEventListener("DOMContentLoaded", () => {
  updateCartHeaderQuantity();
  clearOrderData();
  setTimeout(() => {
    loadOrderDetails(); // ✅ Slight delay to ensure data is available
  }, 300);
});























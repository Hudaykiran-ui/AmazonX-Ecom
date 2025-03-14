import { getProduct } from "../data/products.js";
import {updateCartHeaderQuantity} from "../data/cart.js"

export function trackingOrder() {
  const trackingContainer = document.querySelector(".js-order-tracking");
  if (!trackingContainer) {
    console.error("Tracking container not found in the DOM.");
    return;
  }

  const trackingProductId = localStorage.getItem("trackingProductId");

  if (!trackingProductId) {
    console.warn("No product ID found for tracking.");
    trackingContainer.innerHTML = "<p>No product selected for tracking.</p>";
    return;
  }

  const savedOrders = JSON.parse(localStorage.getItem("orderDetails")) || [];
  let trackingOrderHTML = "<p>Product not found in orders.</p>";

  savedOrders.forEach((order) => {
    order.items.forEach((orderItem) => {
      if (String(orderItem.productId) === trackingProductId) {
        const product = getProduct(orderItem.productId);

        if (!product) {
          console.error("Product not found for ID:", orderItem.productId);
          return;
        }

        if (!orderItem.deliveryDate || !orderItem.deliveryDate) {
          console.warn("Missing order date or delivery date:", orderItem);
          return;
        }

        trackingOrderHTML = `
          <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
              View all orders
            </a>

            <div class="delivery-date">
              Arriving on ${orderItem.deliveryDate || "No delivery date available"}
            </div>

            <div class="product-info">
              <strong>Product:</strong> ${product.name}
            </div>

            <div class="product-info">
              <strong>Quantity:</strong> ${orderItem.quantity}
            </div>

            <img class="product-image" src="${product.image}" alt="${product.name}">

            <div class="progress-labels-container">
              <div class="progress-label">Preparing</div>
              <div class="progress-label">Shipped</div>
              <div class="progress-label">Delivered</div>
            </div>

            <div class="progress-bar-container">
              <div class="progress-bar"></div>
            </div>
          </div>
        `;

        trackingContainer.innerHTML = trackingOrderHTML;

        setTimeout(() => updateProgress(order.date, orderItem.deliveryDate), 100);
      }
    });
  });
}

function updateProgress(date, deliveryDate) {
  const progressBar = document.querySelector(".progress-bar");
  const statusLabels = document.querySelectorAll(".progress-label");

  if (!progressBar) {
    console.warn("Progress bar not found in the DOM.");
    return;
  }

  if (!statusLabels.length) {
    console.warn("Progress labels not found in the DOM.");
    return;
  }

  const today = new Date();

  // Ensure orderPlacedDate is valid
  let orderPlacedDate = date ? new Date(date) : null;

  if (!orderPlacedDate || isNaN(orderPlacedDate)) {
    console.error("Invalid orderPlacedDate:", date);
    return;
  }

  // Calculate shipped date
  let shippedDate = new Date(orderPlacedDate);
  shippedDate.setDate(orderPlacedDate.getDate() + 1); // Ships 1 day after order

  // Ensure deliveredDate is valid
  let deliveredDate = deliveryDate ? new Date(deliveryDate) : null;
  if (!deliveredDate || isNaN(deliveredDate)) {
    console.warn("Invalid deliveredDate, setting default 2 days after shipping.");
    deliveredDate = new Date(shippedDate);
    deliveredDate.setDate(shippedDate.getDate() + 5);
  }
  
  // Fix incorrect year issues
  if (deliveredDate.getFullYear() < 2025) {
    deliveredDate.setFullYear(2025);
  }
  if (shippedDate.getFullYear() < 2025) {
    shippedDate.setFullYear(2025);
  }

  // Handle same-day shipping and delivery cases
  if (deliveredDate <= shippedDate) {
    shippedDate = new Date(deliveredDate);
    shippedDate.setHours(deliveredDate.getHours() - 6); // Ships 6 hours before delivery
  }

  console.log("Today’s Date:", today);
  console.log("Order Placed Date:", orderPlacedDate);
  console.log("Shipped Date:", shippedDate);
  console.log("Delivered Date:", deliveredDate);

  console.log(today >= shippedDate ? "✅ Order is shipped" : "⏳ Still preparing");
  console.log(today >= deliveredDate ? "✅ Order is delivered" : "⏳ Still in transit");

  let progressWidth = 0;
  let statusIndex = 0;
  let progressColor = "green";

  if (deliveredDate && today >= deliveredDate) {
    progressWidth = 100;
    statusIndex = 2;
    progressColor = "green"; // Delivered
  } else if (shippedDate && today >= shippedDate) {
    progressWidth = 66;
    statusIndex = 1;
    progressColor = "orange"; // Shipped
  } else if (orderPlacedDate && today >= orderPlacedDate) {
    progressWidth = 33;
    statusIndex = 0;
    progressColor = "blue"; // Preparing
  }

  console.log("📦 Order Status:", statusIndex === 2 ? "✅ Delivered" : statusIndex === 1 ? "🚚 Shipped" : "⏳ Preparing");

  console.log("Progress Width:", progressWidth);
  console.log("Current Status Index:", statusIndex);

  progressBar.style.width = `${progressWidth}%`;
  progressBar.style.backgroundColor = progressColor;
  progressBar.style.transition = "width 0.8s ease-in-out, background-color 0.8s ease-in-out";

  statusLabels.forEach((label) => label.classList.remove("current-status"));
  statusLabels[statusIndex].classList.add("current-status");
}




document.addEventListener("DOMContentLoaded", () => {
  trackingOrder();
  updateCartHeaderQuantity(); // ✅ Now called after the DOM is ready
});


console.log(JSON.parse(localStorage.getItem("orderDetails")));


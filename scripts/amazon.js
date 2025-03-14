import {products} from '../data/products.js';
import {addToCart, calculateCartQuantity} from '../data/cart.js';

renderProductsGrid(products);

/*
  Main idea of JavaScript
  1. Save the data (Model)
  2. Generate the HTML
  3. Make it interactive
*/

const dashIcon = document.querySelector('.js-dash');
const rightSection = document.querySelector('.js-right-sec');
const xIcon = document.querySelector('.js-x-logo');

dashIcon.addEventListener('click', () =>{
  showIcon();
});

xIcon.addEventListener('click', () =>{
  hideIcon();
});


function showIcon(){
  rightSection.classList.add('js-active');
  dashIcon.classList.add('js-hide');
  xIcon.classList.remove('js-hide')
}

function hideIcon(){
  xIcon.classList.add('js-hide')
  rightSection.classList.remove('js-active');
  dashIcon.classList.remove('js-hide');
}

/*===================================================================== html code lopping =============================================================================*/

//here products are from products.js file

// const products = [
//   {
//     id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
//     image:"images/products/athletic-cotton-socks-6-pairs.jpg",
//     name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
//     rating: {
//       stars:4.5,
//       count: 87
//     },
//     priceCents: 1090,
//     keywords: [
//       "socks",
//       "sports",
//       "apparel"
//     ]
//   },

//   {
//     id: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
//     image: "images/products/intermediate-composite-basketball.jpg",
//     name: "Intermediate Size Basketball",
//     rating: {
//       stars: 4,
//       count: 127
//     },
//     priceCents: 2095,
//     keywords: [
//       "sports",
//       "basketballs"
//     ]
//   },

//   {
//     id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
//     image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
//     name: "Adults Plain Cotton T-Shirt - 2 Pack",
//     rating: {
//       stars: 4.5,
//       count: 56
//     },
//     priceCents: 799,
//     keywords: [
//       "tshirts",
//       "apparel",
//       "mens"
//     ],
//     type: "clothing",
//     sizeChartLink: "images/clothing-size-chart.png"
//   }
// ];

function renderProductsGrid(products){

  let productsHTML = '';

  products.forEach((product) => {

    /*
    // Convert rating to match "rating-40.png" format
    const ratingValue = Math.round(product.rating.stars * 10); // 4.5 → 45, 3.5 → 35, 5 → 50
    const ratingImgPath = `images/ratings/rating-${ratingValue}.png`;
    */

    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
            ${product.name}
        </div>

        <div class="product-rating-container">
          <img  class="product-rating-stars" src="${product.getStarsUrl()}">

            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
        </div>

        <div class="product-price">
            ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTMl()}

        <div class="product-spacer"></div>

        <div class="added-to-cart  js-added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-productid="${product.id}">
            Add to Cart
        </button>
      </div>
    `; 

  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  /*==================================================== upadating cart quantity in header amazon main page =============================================================*/

  function updateCartQuantity(){

    //this calculateCartQuantity() is from cart.js file
    const cartQuantity = calculateCartQuantity();

    // this line belongs to amazon main header cart '.js-cart-quantity' 
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

    // console.log(cartQuantity)
  }

  /*............... addedMessage visible and setTimeout() function ..................*/

  function addedMessage(addedMessageTimeoutId, productId){

    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
        
    addedMessage.classList.add('added-to-cart-visible');

    if (addedMessageTimeoutId) {
      clearTimeout(addedMessageTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);
    
    // Save the timeoutId so we can stop it later.
    addedMessageTimeoutId = timeoutId;
  }

  /*========================================================================== updating cart.js  ========================================================================*/

  document.querySelectorAll('.js-add-to-cart')
    .forEach(button => {

      // closure. Each time we run the loop, it will create
      // a new variable called addedMessageTimeoutId and do
      // button.addEventListener().
      //
      // Then, because of closure, the function we give to
      // button.addEventListener() will get a unique copy
      // of the addedMessageTimeoutId variable and it will
      // keep this copy of the variable forever.
      // (Reminder: closure = if a function has access to a
      // value/variable, it will always have access to that
      // value/variable).
      //
      // This allows us to create many unique copies of the
      // addedMessageTimeoutId variable (one for every time
      // we run the loop) so it lets us keep track of many
      // timeoutIds (one for each product).
      let addedMessageTimeoutId;
      
      button.addEventListener('click', function () {
        const productId = button.dataset.productid;
        
        addToCart(productId); //adding product id and quantity to cart by clicking any product add to cart button
        updateCartQuantity();  
        // addedMessage appear and disappear code.
        addedMessage(addedMessageTimeoutId, productId);

        // console.log(cart)
    
      });
  });

  /*================================================= updating amazon main header cart quantity when page reloads  ======================================================*/

  updateCartQuantity();

}




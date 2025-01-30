document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all Add to Cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    console.log("dom loaded")
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        console.log("adding to cart")
        const variantId = this.getAttribute('data-variant-id');
        const quantityInputId = this.getAttribute('data-quantity-id');
        const quantity = document.getElementById(quantityInputId).value;

        // AJAX request to add to cart
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: variantId, quantity: parseInt(quantity) }),
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error adding to cart');
          }
        })
        .then(data => {
          alert('Added to cart successfully!');
          console.log('Cart data:', data);
        })
        .catch(error => {
          alert('Failed to add to cart. Please try again.');
          console.error(error);
        });
      });
    });
  });
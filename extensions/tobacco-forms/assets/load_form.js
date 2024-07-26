document.addEventListener("DOMContentLoaded", function() {
    console.log("-------------------------------------------------------")
    console.log("fetching page: tobaccoform")
    // const url = vite.import.env.SHOPIFY_APP_URL + '/tobaccoform'
    const url = "https://custom-codes.com/tobaccoform"
    fetch(url)
      .then(response => response.text())
      .then(html => {
        document.getElementById("custom-form-container").innerHTML = html;
      })
      .catch(error => console.error('Error loading custom form:', error));
      
  });
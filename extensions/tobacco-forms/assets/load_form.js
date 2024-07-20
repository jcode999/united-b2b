document.addEventListener("DOMContentLoaded", function() {
    console.log("-------------------------------------------------------")
    console.log("fetching page: tobaccoform")
    fetch("https://custom-codes.com:3000/tobaccoform")
      .then(response => response.text())
      .then(html => {
        document.getElementById("custom-form-container-wrapper").innerHTML = html;
      })
      .catch(error => console.error('Error loading custom form:', error));
  });
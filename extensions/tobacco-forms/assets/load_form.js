// document.addEventListener("DOMContentLoaded", function() {
//     // const url = vite.import.env.SHOPIFY_APP_URL + '/tobaccoform'
//     const url = "http://localhost:49556/tobaccoform"
//     fetch(url)
//       .then(response => response.text())
//       .then(html => {
//         document.getElementById("custom-form-container").innerHTML = html;
//       })
//       .catch(error => console.error('Error loading custom form:', error));
      
//   });
document.addEventListener('DOMContentLoaded', function() {
  console.log("here")
  const form = document.getElementById('customForm');
  const permitNumberInput = document.getElementById('salesAndUseTaxPermitNumber');
  const permitNumberError = document.getElementById('salesAndUseTaxPermitNumberError');

  const isValidPermitNumber = (permitNumber) => /^\d{11}$/.test(permitNumber);

  permitNumberInput.addEventListener('input', function(event) {
    const permitNumber = event.target.value;
    if (isValidPermitNumber(permitNumber)) {
      permitNumberError.style.display = 'none';
    } else {
      permitNumberError.style.display = 'block';
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log("going to post data")
    const formData = new FormData(form);
    const salesAndUseTaxPermitNumber = formData.get("salesAndUseTaxPermitNumber");
    
    if (!isValidPermitNumber(salesAndUseTaxPermitNumber)) {
      permitNumberError.style.display = 'block';
      return;
    }

    // Handle form submission, e.g., via fetch to your backend
    fetch('/apps/proxy', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      console.log(response)
      if(response.ok){
        window.location.href = "https://jigme-store-dev.myshopify.com/cart";
      }
      else{
        permitNumberError.textContent = response.error;
        permitNumberError.style.display = 'block';
      }

    })
    // .then(data => {
    //   console.log("data recieved from server: ",data)
    //   if (data.error) {
    //     console.log(data.error);
    //     permitNumberError.textContent = data.error;
    //     permitNumberError.style.display = 'block';
    //   } else {
    //     window.location.href = "https://jigme-store-dev.myshopify.com/";
    //   }
    // })
    // .catch(error => {
    //   permitNumberError.textContent = 'Failed to submit the form. Please try again later.';
    //   permitNumberError.style.display = 'block';
      
    // });
  });
});




        


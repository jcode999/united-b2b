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
        window.location.href = "https://united-wholesale.com/pages/confirmation-page";
      }
      else{
        permitNumberError.textContent = response.error;
        permitNumberError.style.display = 'block';
      }

    })
  });
});




        


document.addEventListener('DOMContentLoaded', function() {
    let currentSection = 0;
    console.log("erasasdasdfasdfsaferasdf")
    const sections = document.querySelectorAll('.form-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    console.log("sections: ",sections.length)
    // sections[0].classList.add('active')
    // console.log(sections[0])
    function updateButtons() {
        
        prevBtn.disabled = currentSection === 0;
        nextBtn.style.display = currentSection === sections.length - 1 ? 'none' : 'inline-block';
        submitBtn.style.display = currentSection === sections.length - 1 ? 'inline-block' : 'none';
    }

    function validateSection(index) {
        const inputs = sections[index].querySelectorAll('input[required]');
        let isValid = true;
        let firstInvalidInput = null;
    
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                if (!firstInvalidInput) {
                    firstInvalidInput = input;
                }
                input.classList.add('shake');
    
                // Remove the shake class after animation completes
                setTimeout(() => {
                    input.classList.remove('shake');
                }, 300);
            }
        });
    
        const errorMessage = sections[index].querySelector('.error-message');
        if (!isValid) {
            errorMessage.style.display = 'block';
            firstInvalidInput.focus();
        } else {
            errorMessage.style.display = 'none';
        }
    
        return isValid;
    }
    

    function showSection(index) {
        sections.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        updateButtons();
    }

    function nextSection() {
        if (validateSection(currentSection)) {
            if (currentSection < sections.length - 1) {
                currentSection++;
                showSection(currentSection);
            }
        }
    }
    

    function prevSection() {
        if (currentSection > 0) {
            currentSection--;
            showSection(currentSection);
        }
    }
    prevBtn.addEventListener('click',prevSection)
    nextBtn.addEventListener('click',nextSection)
    // window.submitForm = function() {
    //     alert("Form submitted!");
    //     // Add form submission logic here
    // }

    // Initialize the first section as active
    showSection(currentSection);

    const form = document.getElementById('customForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log("going to post data")
        const formData = new FormData(form);
        
    
        // if (!isValidPermitNumber(salesAndUseTaxPermitNumber)) {
        //   permitNumberError.style.display = 'block';
        //   return;
        // }
    
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
          
    
        })
      });
});

const data = [
    { text: "CBD", icon: "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/cbd.png?v=1738043571" },
    { text: "Kratom", icon: "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/kratom.png?v=1738043571" },
    { text: "Lighter", icon: "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/lighter.png?v=1738043571" },
    { text: "Vapes", icon: "https://cdn.shopify.com/s/files/1/0738/7919/1841/files/vapes.png?v=1738043571" }
];

const textContainer = document.querySelector('.app-text');
const iconContainer = document.querySelector('.app-icon');

function displayStrings(data, delayBetweenStrings = 2000) {
    let currentIndex = 0;

    function animateString({ text, icon }) {
        textContainer.innerHTML = ''; // Clear previous string
        iconContainer.src = ''; // Clear previous icon
        iconContainer.classList.remove('visible'); // Hide the icon
        console.log("app text: ",text)
        // Add characters with animation
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('app-char');
            span.style.animationDelay = `${index * 0.1}s`; // Delay for each character
            textContainer.appendChild(span);
        });

        // Update the icon's `src` and make it visible after text animation
        const totalAnimationTime = text.length * 0.1 * 1000; // Total time in ms
        setTimeout(() => {
            iconContainer.src = icon; // Set the image source (local path)
            iconContainer.classList.add('visible'); // Make the icon visible
        }, 0); // Add slight delay for better timing
    }

    function showNext() {
        if (currentIndex >= data.length) {
            currentIndex = 0; // Loop to the first string
        }
        animateString(data[currentIndex]);
        currentIndex++;
        setTimeout(showNext, delayBetweenStrings);
    }

    showNext();
}

displayStrings(data);
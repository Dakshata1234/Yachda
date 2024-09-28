// Get elements from the DOM
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const imageForm = document.getElementById('imageForm');
const resultDiv = document.getElementById('result');

// Event listener for image input to display the image preview
imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            // Create an img element and set the source
            const img = document.createElement('img');
            img.src = e.target.result;
            
            // Clear any previous images in the preview
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
        };

        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = 'Your image preview will appear here.';
    }
});

// Event listener for form submission
imageForm.addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the default form submission
    
    const file = imageInput.files[0];
    
    if (!file) {
        alert('Please upload an image');
        return;
    }

    // Create a FormData object to send the image to the server
    const formData = new FormData();
    formData.append('image', file);

    // Simulate fetching the result (replace with actual backend request)
    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Display the result (predicted class) returned by the server
        resultDiv.textContent = `🌟 Predicted Class: ${data.class} 🌟`;
        resultDiv.style.color = '#FF8A00';  // Color change animation
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.textContent = '❌ Error making prediction';
        resultDiv.style.color = '#E52E71';
    });
});

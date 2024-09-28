// Switch between sections
document.getElementById('homeLink').addEventListener('click', function () {
    setActiveSection('home');
});

document.getElementById('searchLink').addEventListener('click', function () {
    setActiveSection('search');
});

document.getElementById('historyLink').addEventListener('click', function () {
    setActiveSection('history');
});

function setActiveSection(section) {
    document.querySelectorAll('.content-section').forEach(function (section) {
        section.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
}

// Handle image preview
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

imageInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.innerHTML = '';
            imagePreview.appendChild(img);
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.innerHTML = 'Your image preview will appear here.';
    }
});

// Handle form submission and prediction
const imageForm = document.getElementById('imageForm');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('historyList');

imageForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const file = imageInput.files[0];
    if (!file) {
        alert('Please upload an image.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            const predictedClass = `🌿 Predicted Class: ${"C:\Users\Dakshata Abhyankar\Downloads\model.pkl"}`;
            resultDiv.textContent = predictedClass;
            addHistoryItem(file.name, predictedClass);
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.textContent = '❌ Error making prediction';
        });
});

// Add history items
function addHistoryItem(imageName, predictedClass) {
    const listItem = document.createElement('li');
    listItem.textContent = `Image: ${imageName} - Result: ${predictedClass}`;
    historyList.appendChild(listItem);
}

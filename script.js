const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const checkButton = document.getElementById('check');

// Function to store in localStorage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Function to retrieve from localStorage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear localStorage (for debugging)
function clearStorage() {
  localStorage.clear();
}

// Function to generate SHA256 hash
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate & store SHA256 hash for a random 3-digit number
async function generateHash() {
  let storedHash = retrieve('sha256');
  let storedPin = retrieve('pin');

  if (!storedHash || !storedPin) {
    let pin = getRandomNumber(MIN, MAX).toString();
    let hash = await sha256(pin);

    store('sha256', hash);
    store('pin', pin);
    storedHash = hash;
  }

  sha256HashView.innerHTML = storedHash; // Display the hash
}

// Validate user's guess
async function checkGuess() {
  const userInput = pinInput.value;

  // Ensure input is exactly 3 digits
  if (userInput.length !== 3) {
    resultView.innerHTML = '⚠️ Enter a 3-digit number!';
    resultView.classList.remove('hidden');
    return;
  }

  const userHash = await sha256(userInput);
  const storedHash = retrieve('sha256');

  if (userHash === storedHash) {
    resultView.innerHTML = '🎉 Success! You found the number!';
    resultView.style.backgroundColor = '#28a745';
  } else {
    resultView.innerHTML = '❌ Incorrect. Try again!';
    resultView.style.backgroundColor = '#dc3545';
  }

  resultView.classList.remove('hidden');
}

// Ensure input only allows numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the check function to the button
checkButton.addEventListener('click', checkGuess);

// Initialize
generateHash();

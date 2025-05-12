// Get elements
const countdownDisplay = document.getElementById("countdown-timer");
const changeBtn = document.getElementById("change-deadline");
const modal = document.getElementById("deadline-modal");
const deadlineInput = document.getElementById("deadline-input");
const saveBtn = document.getElementById("save-deadline");
const cancelBtn = document.getElementById("cancel-deadline");

let deadline = localStorage.getItem("deadline") || null;
let countdownInterval = null;

// Open modal
changeBtn.addEventListener("click", () => {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  // Pre-fill input if deadline exists
  if (deadline) {
    deadlineInput.value = new Date(deadline).toISOString().slice(0, 16);
  }
});

// Close modal
cancelBtn.addEventListener("click", () => {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
});

// Save new deadline
saveBtn.addEventListener("click", () => {
  deadline = deadlineInput.value;
  if (!deadline) return;

  localStorage.setItem("deadline", deadline);
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  startCountdown();
});

// Countdown logic
function startCountdown() {
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    if (!deadline) {
      countdownDisplay.textContent = "No deadline set";
      return;
    }

    const now = new Date().getTime();
    const target = new Date(deadline).getTime();
    const distance = target - now;

    if (distance <= 0) {
      countdownDisplay.textContent = "⏰ Time's up!";
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    countdownDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
}

// Start countdown on page load
if (deadline) {
  startCountdown();
} else {
  countdownDisplay.textContent = "No deadline set";
}

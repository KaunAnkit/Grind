// ===== State =====
let timer;
let isRunning = false;
let customTime = 25;
let timeLeft = customTime * 60;

let timeLogs = JSON.parse(localStorage.getItem("timeLogs")) || {};
let timeGoals = JSON.parse(localStorage.getItem("timeGoals")) || {};
let subjects = Object.keys(timeLogs).length ? Object.keys(timeLogs) : ["CODING", "WORKOUT", "MATHS"];
let currentTab = subjects[0];

// ===== DOM Elements =====
const timerDisplay = document.getElementById("pomodoro-timer");
const startPauseBtn = document.getElementById("startPauseBtn");
const settingsBtn = document.getElementById("open-settings");
const settingsModal = document.getElementById("settings-modal");
const customTimeInput = document.getElementById("custom-time");
const saveSettingsBtn = document.getElementById("save-settings");
const cancelSettingsBtn = document.getElementById("cancel-settings");
const resetBtn = document.getElementById("reset-settings");
const timeLogDisplay = document.getElementById("time-log-display");
const resetProgressBtn = document.getElementById("reset-progress");

const goalModal = document.getElementById("goal-modal");
const openGoalBtn = document.getElementById("set-goals");
const saveGoalBtn = document.getElementById("save-goals");
const cancelGoalBtn = document.getElementById("cancel-goals");
const goalInputsContainer = document.getElementById("goal-inputs");

const subjectModal = document.getElementById("subject-modal");
const subjectList = document.getElementById("subject-list");
const addSubjectBtn = document.getElementById("add-subject");
const closeSubjectModalBtn = document.getElementById("close-subject-modal");
const newSubjectInput = document.getElementById("new-subject-name");

// ===== Utility =====
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function saveSubjects() {
  localStorage.setItem("timeLogs", JSON.stringify(timeLogs));
  localStorage.setItem("timeGoals", JSON.stringify(timeGoals));
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, "0")} : ${remainingSeconds.toString().padStart(2, "0")}`;
}

function updateTimeDisplay() {
  const seconds = timeLogs[currentTab] || 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  timeLogDisplay.textContent = `Time Spent on ${currentTab}: ${mins}m ${secs}s`;
}

function updateProgressBars() {
  const container = document.getElementById("progress-section");
  const body = container.querySelectorAll(".progress-row");
  body.forEach(row => row.remove());

  subjects.forEach(subject => {
    const goal = timeGoals[subject] || 3600;
    const timeSpent = timeLogs[subject] || 0;
    const percent = Math.min((timeSpent / goal) * 100, 100);

    const row = document.createElement("div");
    row.className = "progress-row";
    row.dataset.subject = subject;

    row.innerHTML = `
      <div class="label"><strong>${subject}</strong> Goal: <span class="goal-time">${formatTime(goal)}</span></div>
      <div class="progress-bar"><div class="fill" style="width: ${percent}%;"></div></div>
      <div class="time-display">${formatTime(timeSpent)} ${Math.floor(percent)}%</div>
    `;
    container.appendChild(row);
  });
}

function renderTabs() {
  const tabContainer = document.getElementById("subject-tabs");
  tabContainer.innerHTML = "";

  subjects.forEach(subj => {
    const btn = document.createElement("button");
    btn.className = "tab" + (subj === currentTab ? " active" : "");
    btn.textContent = subj;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      currentTab = subj;
      updateTimeDisplay();
      updateProgressBars();
    });
    tabContainer.appendChild(btn);
  });
}

// ===== Timer Logic =====
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay(timeLeft);

    timeLogs[currentTab] = (timeLogs[currentTab] || 0) + 1;
    saveSubjects();
    updateTimeDisplay();
    updateProgressBars();

    if (timeLeft <= 0) {
      clearInterval(timer);
      isRunning = false;
      startPauseBtn.textContent = "▶ Start";
      alert("Time's up!");
    }
  }, 1000);
}

function toggleTimer() {
  if (isRunning) {
    clearInterval(timer);
    startPauseBtn.textContent = "▶ Start";
  } else {
    startPauseBtn.textContent = "⏸ Pause";
    startTimer();
  }
  isRunning = !isRunning;
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = customTime * 60;
  updateTimerDisplay(timeLeft);
  startPauseBtn.textContent = "▶ Start";
  updateTimeDisplay();
  updateProgressBars();
}

// ===== Settings Modal =====
function showSettingsModal() {
  settingsModal.style.display = "block";
  customTimeInput.value = customTime;
}

function hideSettingsModal() {
  settingsModal.style.display = "none";
}

function saveCustomTime() {
  customTime = parseInt(customTimeInput.value);
  timeLeft = customTime * 60;
  updateTimerDisplay(timeLeft);
  hideSettingsModal();
  updateTimeDisplay();
}

// ===== Study Goal Modal (Dynamic) =====
openGoalBtn.addEventListener("click", () => {
  goalInputsContainer.innerHTML = "";

  subjects.forEach(subject => {
    const minutes = (timeGoals[subject] || 3600) / 60;
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";
    wrapper.innerHTML = `
      <label for="goal-${subject}" style="display:block; text-align:left;">${subject}:</label>
      <input type="number" id="goal-${subject}" value="${minutes}" min="1" />
    `;
    goalInputsContainer.appendChild(wrapper);
  });

  goalModal.style.display = "block";
});

cancelGoalBtn.addEventListener("click", () => {
  goalModal.style.display = "none";
});

saveGoalBtn.addEventListener("click", () => {
  subjects.forEach(subject => {
    const input = document.getElementById(`goal-${subject}`);
    const value = parseInt(input.value);
    if (!isNaN(value)) {
      timeGoals[subject] = value * 60;
    }
  });

  saveSubjects();
  goalModal.style.display = "none";
  updateProgressBars();
});

// ===== Subject Modal =====
document.getElementById("edit-subjects").addEventListener("click", () => {
  subjectList.innerHTML = subjects.map(subj => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
      <span>${subj}</span>
      <button onclick="removeSubject('${subj}')">🗑</button>
    </div>
  `).join("");
  subjectModal.style.display = "flex";
});

addSubjectBtn.addEventListener("click", () => {
  const name = newSubjectInput.value.trim().toUpperCase();
  if (name && !subjects.includes(name)) {
    subjects.push(name);
    timeLogs[name] = 0;
    timeGoals[name] = 3600;
    saveSubjects();
    renderTabs();
    updateProgressBars();
    newSubjectInput.value = "";
  }
});

closeSubjectModalBtn.addEventListener("click", () => {
  subjectModal.style.display = "none";
});

window.removeSubject = function (name) {
  subjects = subjects.filter(s => s !== name);
  delete timeLogs[name];
  delete timeGoals[name];
  saveSubjects();
  renderTabs();
  updateProgressBars();
};

// ===== Fullscreen =====
function openFullscreen() {
  const elem = document.getElementById("cardTime");
  elem.classList.add("fullscreen-active");

  if (elem.requestFullscreen) elem.requestFullscreen();
  else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
  else if (elem.msRequestFullscreen) elem.msRequestFullscreen();

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      elem.classList.remove("fullscreen-active");
    }
  });
}

// ===== Reset Progress =====
resetProgressBtn.addEventListener("click", () => {
  subjects.forEach(s => timeLogs[s] = 0);
  saveSubjects();
  updateTimeDisplay();
  updateProgressBars();
});

// ===== Events =====
startPauseBtn.addEventListener("click", toggleTimer);
settingsBtn.addEventListener("click", showSettingsModal);
saveSettingsBtn.addEventListener("click", saveCustomTime);
cancelSettingsBtn.addEventListener("click", hideSettingsModal);
resetBtn.addEventListener("click", resetTimer);

// ===== Initial Load =====
renderTabs();
updateTimerDisplay(timeLeft);
updateTimeDisplay();
updateProgressBars();

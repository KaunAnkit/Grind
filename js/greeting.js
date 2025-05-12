document.addEventListener("DOMContentLoaded", () => {
  const usernameModal = document.getElementById("username-modal");
  const usernameInput = document.getElementById("username-input");
  const saveUsernameBtn = document.getElementById("save-username");
  const greetingEl = document.getElementById("user-greeting");
  const changeNameBtn = document.getElementById("change-name");

if (changeNameBtn) {
  changeNameBtn.addEventListener("click", () => {
    localStorage.removeItem("userName");
    showUsernameModal();
  });
}


  function showUsernameModal() {
    usernameModal.classList.add("show");
    usernameModal.setAttribute("aria-hidden", "false");
  }

  function hideUsernameModal() {
    usernameModal.classList.remove("show");
    usernameModal.setAttribute("aria-hidden", "true");
  }

  function updateGreeting(name) {
    if (greetingEl) {
      greetingEl.textContent = `Hey, ${name}! 👋`;
    }
  }

  const storedName = localStorage.getItem("userName");
  if (!storedName) {
    showUsernameModal();
  } else {
    updateGreeting(storedName);
  }

  if (saveUsernameBtn) {
    saveUsernameBtn.addEventListener("click", () => {
      const name = usernameInput.value.trim();
      if (name) {
        localStorage.setItem("userName", name);
        updateGreeting(name);
        hideUsernameModal();
      }
    });
  }
});
usernameInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    saveUsernameBtn.click();
  }
});

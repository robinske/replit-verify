const leaderboardEl = document.getElementById("leaderboard");
const leaderboardErrorEl = document.getElementById("leaderboard-error");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = !message;
}

function renderLeaderboard(names) {
  leaderboardEl.innerHTML = "";

  if (names.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No names yet — be the first to suggest one!";
    leaderboardEl.appendChild(li);
    return;
  }

  names.forEach((entry, index) => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="name-info">
        <span class="name">${escapeHtml(entry.name)}</span>
      </span>
      <span class="votes">${entry.votes} 🐾</span>
      <button class="vote-btn" data-id="${entry.id}">Vote</button>
    `;
    leaderboardEl.appendChild(li);
  });
}

async function loadNames() {
  try {
    const res = await fetch("/api/names");
    if (!res.ok) throw new Error("Failed to load leaderboard.");
    const names = await res.json();
    showError(leaderboardErrorEl, "");
    renderLeaderboard(names);
  } catch (err) {
    showError(leaderboardErrorEl, "Couldn't load the leaderboard. Try refreshing.");
  }
}

leaderboardEl.addEventListener("click", async (e) => {
  const btn = e.target.closest(".vote-btn");
  if (!btn) return;

  btn.disabled = true;
  try {
    const res = await fetch(`/api/names/${btn.dataset.id}/vote`, { method: "POST" });
    if (!res.ok) throw new Error("Vote failed.");
    await loadNames();
  } catch (err) {
    showError(leaderboardErrorEl, "Couldn't register that vote. Try again.");
    btn.disabled = false;
  }
});

loadNames();

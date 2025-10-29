document.getElementById("reminderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("email").value,
    title: document.getElementById("title").value,
    message: document.getElementById("message").value,
    dateTime: document.getElementById("dateTime").value,
  };

  const res = await fetch("/api/reminders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  document.getElementById("response").innerText = result.message;
});

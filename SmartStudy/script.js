document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const syllabus = document.getElementById("syllabus").value.trim();
  const days = document.getElementById("days").value.trim();
  const output = document.getElementById("output");
  output.textContent = "Generating schedule...";

  try {
    const response = await fetch("/SmartStudy/api/schedule.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ syllabus, days }),
    });

    const data = await response.json();

    if (data.error) {
      output.textContent = "❌ Error: " + data.error;
    } else {
      output.innerHTML = `
          <h4>🔥 Important Topics (80/20):</h4>
          <pre>${data.importantTopics}</pre>
          <h4>📅 Study Schedule:</h4>
          <pre>${data.schedule}</pre>
        `;
    }
  } catch (err) {
    output.textContent = "❌ Failed to generate schedule.";
    console.error(err);
  }
});

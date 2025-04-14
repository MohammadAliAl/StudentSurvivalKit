const fetch = require("node-fetch");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

module.exports = async (req, res) => {
  if (req.method === "POST") {
    const { syllabus, days } = req.body;

    try {
      const paretoPrompt = `
        Apply the 80/20 rule to this syllabus. Return only the most important 20% of topics:
        ${syllabus}
      `;

      const paretoRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: paretoPrompt }],
            temperature: 0.5,
          }),
        }
      );

      const paretoData = await paretoRes.json();
      const importantTopics = paretoData.choices[0].message.content.trim();

      const schedulePrompt = `
        Based on these important topics and ${days} days to study, make a daily schedule:
        ${importantTopics}
      `;

      const scheduleRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: schedulePrompt }],
            temperature: 0.6,
          }),
        }
      );

      const scheduleData = await scheduleRes.json();
      const schedule = scheduleData.choices[0].message.content.trim();

      res.status(200).json({ importantTopics, schedule });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate schedule." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

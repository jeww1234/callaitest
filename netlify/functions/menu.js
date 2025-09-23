// netlify/functions/menu.js
import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { userInput } = JSON.parse(event.body);

    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);
    console.log("userInput:", userInput);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that recommends food.",
          },
          {
            role: "user",
            content: `User is feeling: "${userInput}". Recommend a food.`,
          },
        ],
        max_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenAI API error:", errText);
      return { statusCode: 500, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const menu = data.choices[0].message.content.trim();

    return { statusCode: 200, body: JSON.stringify({ menu }) };
  } catch (error) {
    console.error("Function error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}

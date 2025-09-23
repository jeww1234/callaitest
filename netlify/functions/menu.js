import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const { userInput } = JSON.parse(event.body);

    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `User feels: "${userInput}". Suggest a food.`,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Hugging Face API error:", errText);
      return { statusCode: 500, body: JSON.stringify({ error: errText }) };
    }

    const data = await response.json();
    const menu = data?.[0]?.generated_text?.trim() || "No suggestion available.";

    return {
      statusCode: 200,
      body: JSON.stringify({ menu }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
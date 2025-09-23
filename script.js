// script.js
async function getMenu() {
  const text = document.getElementById("userInput").value;
  if (!text) return alert("Please enter a sentence!");

  // Netlify Functions 호출
  const response = await fetch("/.netlify/functions/menu", {
    method: "POST",
    body: JSON.stringify({ userInput: text }),
  });

  const data = await response.json();
  document.getElementById("result").innerText =
    "🤖 AI recommended menu: " + data.menu;

  
}

document.getElementById("menuBtn").addEventListener("click", getMenu);

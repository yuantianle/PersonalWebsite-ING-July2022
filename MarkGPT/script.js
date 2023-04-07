const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const chatMessages = document.getElementById('chat-messages');

sendButton.addEventListener('click', async () => {
  const userMessage = messageInput.value.trim();
  if (userMessage) {
    addMessage('User', userMessage);
    messageInput.value = '';

    const gptMessage = await fetchGptResponse(userMessage);
    addMessage('GPT Chatbot', gptMessage);
  }
});

function addMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('chat-message');
  messageElement.innerHTML = `<span class="name">${sender}:</span> ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchGptResponse(userMessage) {
  const response = await fetch('API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer GPT_API_KEY'
    },
    body: JSON.stringify({
      prompt: `As a chatbot with the personal characteristics of [Your Name], ${userMessage}`,
      max_tokens: 50
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim();
}
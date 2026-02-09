
document.addEventListener('DOMContentLoaded', () => {
    // Inject HTML Structure
    const chatHTML = `
        <div class="chat-widget-container">
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <span>🏥 Hospital AI Assistant</span>
                    <span style="cursor:pointer" onclick="toggleChat()">✕</span>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="message ai">
                        Hello! I am your AI assistant. I can help you with hospital data based on your role.
                    </div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chatInput" placeholder="Ask something..." onkeypress="handleEnter(event)">
                    <button onclick="sendMessage()">➤</button>
                </div>
            </div>
            <div class="chat-launcher" onclick="toggleChat()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
});

function toggleChat() {
    const window = document.getElementById('chatWindow');
    window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
}

function handleEnter(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    input.value = '';

    // Show Loading
    const loadingId = addMessage('Thinking...', 'ai', true);

    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        const response = await fetch('/api/chat/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: text,
                userId: user.userId || 'anonymous',
                role: user.role || 'GUEST'
            })
        });

        const data = await response.json();

        // Remove Loading
        document.getElementById(loadingId).remove();

        if (data.success) {
            const aiResponse = data.data.response;
            const explanation = data.data.explanation;
            addMessage(aiResponse, 'ai', false, explanation);
        } else {
            addMessage("Error: " + data.message, 'ai');
        }

    } catch (err) {
        document.getElementById(loadingId).remove();
        addMessage("Network Error: Could not connect to AI.", 'ai');
    }
}

function addMessage(text, type, isLoading = false, explanation = null) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerText = text;

    if (explanation) {
        const explDiv = document.createElement('div');
        explDiv.className = 'chat-explanation';
        explDiv.innerText = "💡 " + explanation;
        div.appendChild(explDiv);
    }

    if (isLoading) div.id = 'loading-' + Date.now();

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
}

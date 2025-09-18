// Current selected language and theme state
let currentLanguage = 'en';
let isDarkMode = false;

// Box options and their content in different languages
const boxContent = {
    symptomChecker: {
        en: {
            options: [
                { id: 'general', icon: 'fas fa-stethoscope', label: 'General Health Check', 
                  description: 'Get a general health assessment and recommendations' },
                { id: 'emergency', icon: 'fas fa-exclamation-circle', label: 'Emergency Symptoms', 
                  description: 'Urgent medical concerns and immediate actions' },
                { id: 'chronic', icon: 'fas fa-chart-line', label: 'Chronic Conditions', 
                  description: 'Long-term health condition management' },
                { id: 'mental', icon: 'fas fa-brain', label: 'Mental Health', 
                  description: 'Mental health support and resources' }
            ]
        },
        hi: {
            options: [
                { id: 'general', icon: 'fas fa-stethoscope', label: '???? ????? ??',
                  description: '????? ????? ?? ???? ???? ??' },
                { id: 'emergency', icon: 'fas fa-exclamation-circle', label: '?????? ????',
                  description: '???? ???? ??? ?? ?????' },
                { id: 'chronic', icon: 'fas fa-chart-line', label: '?????? ???',
                  description: '?? ??? ? ????? ??? ?????' },
                { id: 'mental', icon: 'fas fa-brain', label: '???? ?????',
                  description: '???? ????? ???? ?? ????' }
            ]
        }
    }
};

// Make boxes responsive
function initializeBoxes() {
    const boxes = document.querySelectorAll(".info-box");
    boxes.forEach(box => {
        box.addEventListener("click", function(e) {
            if (!e.target.closest(".action-btn") && !e.target.closest(".options-popup")) {
                const boxType = this.getAttribute("data-box");
                showBoxOptions(boxType, this);
            }
        });
    });
}

// Show options for clicked box
function showBoxOptions(boxType, box) {
    removeExistingPopups();
    const content = boxContent[boxType]?.[currentLanguage] || boxContent[boxType]?.["en"];
    if (!content) return;

    const popup = createOptionsPopup(content.options, boxType);
    positionPopup(popup, box);
    document.addEventListener("click", handleClickOutside);
}

// Create options popup
function createOptionsPopup(options, boxType) {
    const popup = document.createElement("div");
    popup.className = "options-popup";
    popup.setAttribute("data-popup", boxType);

    const ul = document.createElement("ul");
    options.forEach(option => {
        const li = document.createElement("li");
        li.innerHTML = `
            <button class="option-btn" onclick="handleBoxOption('${boxType}', '${option.id}')">
                <i class="${option.icon}"></i>
                <div class="option-content">
                    <span class="option-label">${option.label}</span>
                    <span class="option-description">${option.description}</span>
                </div>
            </button>
        `;
        ul.appendChild(li);
    });

    popup.appendChild(ul);
    document.body.appendChild(popup);
    return popup;
}

// Position popup relative to box
function positionPopup(popup, box) {
    const boxRect = box.getBoundingClientRect();
    popup.style.position = "absolute";
    popup.style.top = `${boxRect.bottom + window.scrollY + 10}px`;
    popup.style.left = `${boxRect.left + window.scrollX}px`;
    popup.style.minWidth = `${boxRect.width}px`;
}

// Enhanced chat functionality
function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `
        <div class="chat-avatar ${sender}">
            <i class="fas fa-${sender === "user" ? "user" : "robot"}"></i>
        </div>
        <div class="chat-bubble">
            ${message}
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const chatInput = document.getElementById("chatInput");
    if (!chatInput || !chatInput.value.trim()) return;

    const userMessage = chatInput.value.trim();
    addMessageToChat(userMessage, "user");
    chatInput.value = "";

    // Show typing indicator while AI processes response
    showTypingIndicator();

    // Generate and display AI response with a slight delay for natural feeling
    setTimeout(() => {
        removeTypingIndicator();
        const response = generateAIResponse(userMessage);
        addMessageToChat(response, "bot");
    }, 1000);
}

function showTypingIndicator() {
    const chatMessages = document.getElementById("chatMessages");
    if (!chatMessages) return;

    const typingDiv = document.createElement("div");
    typingDiv.className = "chat-message bot typing-indicator";
    typingDiv.innerHTML = `
        <div class="chat-avatar bot">
            <i class="fas fa-robot"></i>
        </div>
        <div class="chat-bubble">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.querySelector(".typing-indicator");
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// AI Medical Assistant Response Generator
function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Symptom and condition patterns
    const patterns = {
        headache: /headache|head( pain)|migraine/i,
        fever: /fever|temperature|feeling hot|chills/i,
        cough: /cough|coughing|chest congestion/i,
        breathing: /breath|breathing difficulty|shortness of breath|asthma/i,
        chest: /chest pain|heart|cardiac|palpitation/i,
        stomach: /stomach|abdomen|digestive|nausea|vomiting/i,
        mental: /anxiety|depression|stress|mental health|feeling down/i,
        emergency: /emergency|urgent|severe|extreme|critical/i,
        medication: /medicine|medication|drug|prescription/i,
        chronic: /diabetes|blood pressure|arthritis|chronic/i,
        general: /checkup|general health|wellness|health tips/i,
        sleep: /sleep|insomnia|cant sleep|tired/i
    };

    // Emergency conditions check
    if (patterns.emergency.test(message) || patterns.chest.test(message)) {
        return " MEDICAL EMERGENCY ALERT \n\n" +
               "If you're experiencing:\n" +
               "- Severe chest pain\n" +
               "- Difficulty breathing\n" +
               "- Severe bleeding\n" +
               "- Loss of consciousness\n\n" +
               "PLEASE CALL EMERGENCY SERVICES IMMEDIATELY (911 or your local emergency number).\n" +
               "Do not wait for an online response. Every minute counts in an emergency.";
    }

    // Specific symptom responses
    if (patterns.headache.test(message)) {
        return "I understand you're experiencing a headache. Let's assess this:\n\n" +
               "Quick questions:\n" +
               "1. How long have you had the headache?\n" +
               "2. How severe is the pain (1-10)?\n" +
               "3. Any other symptoms?\n\n" +
               "Immediate steps you can take:\n" +
               " Rest in a quiet, dark room\n" +
               " Stay hydrated\n" +
               " Try over-the-counter pain relievers\n\n" +
               " Seek immediate medical attention if you experience:\n" +
               "- Sudden, severe headache\n" +
               "- Headache with fever and stiff neck\n" +
               "- Headache after head injury";
    }

    if (patterns.fever.test(message)) {
        return "For fever management:\n\n" +
               "Immediate actions:\n" +
               "1. Monitor your temperature regularly\n" +
               "2. Stay hydrated (drink plenty of fluids)\n" +
               "3. Rest\n" +
               "4. Use fever-reducing medication if needed\n\n" +
               " Seek immediate medical care if:\n" +
               "- Temperature exceeds 103F (39.4C)\n" +
               "- Fever lasts more than 3 days\n" +
               "- You have other severe symptoms\n\n" +
               "Would you like specific fever management tips?";
    }

    if (patterns.breathing.test(message)) {
        return "Breathing difficulties require immediate attention:\n\n" +
               "If you're experiencing:\n" +
               "- Severe shortness of breath\n" +
               "- Blue lips or face\n" +
               "- Inability to speak full sentences\n" +
               " Seek emergency care immediately!\n\n" +
               "For mild breathing issues:\n" +
               "1. Sit upright\n" +
               "2. Use prescribed inhalers if you have them\n" +
               "3. Try breathing exercises\n" +
               "4. Avoid triggers (smoke, allergens)";
    }

    if (patterns.mental.test(message)) {
        return "Your mental health is important. Let's talk about it:\n\n" +
               "Immediate coping strategies:\n" +
               "1. Take slow, deep breaths\n" +
               "2. Ground yourself (5 things you can see, 4 you can touch...)\n" +
               "3. Call a trusted friend or family member\n\n" +
               "Resources available:\n" +
               " Crisis Helpline: 988 (US)\n" +
               " Online counseling services\n" +
               " Support groups\n\n" +
               "Would you like information about professional mental health services in your area?";
    }

    if (patterns.medication.test(message)) {
        return "Medication safety is crucial:\n\n" +
               "Important reminders:\n" +
               "1. Always take medications as prescribed\n" +
               "2. Don't skip doses or stop without consulting your doctor\n" +
               "3. Be aware of potential interactions\n" +
               "4. Store medications properly\n\n" +
               "Would you like:\n" +
               " Information about specific medications?\n" +
               " Help finding a pharmacy?\n" +
               " Medication interaction checker?";
    }

    // Default response for unrecognized queries
    return "I'm here to help with your health concerns. To provide better assistance, please:\n\n" +
           "1. Describe your symptoms in detail\n" +
           "2. Mention how long you've had them\n" +
           "3. List any medications you're taking\n" +
           "4. Note any other health conditions\n\n" +
           "Remember: I'm an AI assistant providing general health information. For specific medical advice, please consult a healthcare provider.";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function() {
    initializeBoxes();
    
    // Initialize dark mode
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
        isDarkMode = savedTheme === "true";
        document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
        const themeIcon = document.getElementById("themeIcon");
        if (themeIcon) {
            themeIcon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
        }
    }
    
    // Initialize chat with greeting
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages) {
        chatMessages.innerHTML = "";
        addMessageToChat(getGreetingResponse(currentLanguage), "bot");
    }

    // Add enter key handler for chat input
    const chatInput = document.getElementById("chatInput");
    if (chatInput) {
        chatInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
});

// Other utility functions
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    const themeIcon = document.getElementById("themeIcon");
    if (themeIcon) {
        themeIcon.className = isDarkMode ? "fas fa-sun" : "fas fa-moon";
    }
    localStorage.setItem("darkMode", isDarkMode);
}

function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", ["ar", "fa", "he", "ur"].includes(lang) ? "rtl" : "ltr");
    updateInterface();
}

function getGreetingResponse(lang) {
    const greetings = {
        en: " Hello! I'm your AI Medical Assistant. I can help you with:\n\n" +
            " Symptom assessment\n" +
            " Health guidance\n" +
            " Emergency information\n" +
            " Mental health support\n" +
            " Medication information\n\n" +
            "Please describe your health concern, and I'll do my best to help. Remember, for emergencies, always call your local emergency services.",
        hi: " ????! ? ??? AI ???? ???? ? ? ??? ?? ??? ? ??? ?? ??? ?:\n\n" +
            " ???? ? ????\n" +
            " ????? ???????\n" +
            " ?????? ????\n" +
            " ???? ????? ????\n" +
            " ?? ??? ????\n\n" +
            "??? ??? ????? ???? ???, ? ??? ??? ? ?? ??? ??? ?? ??, ?????? ??? ? ??? ??? ???? ?????? ??? ? ?? ??"
    };
    return greetings[lang] || greetings.en;
}

function updateInterface() {
    removeExistingPopups();
    const chatMessages = document.getElementById("chatMessages");
    if (chatMessages) {
        chatMessages.innerHTML = "";
        addMessageToChat(getGreetingResponse(currentLanguage), "bot");
    }
}

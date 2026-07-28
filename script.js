const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  const WORKER_URL = "https://nandha-ai-assistant.nandhabuilds.workers.dev";
  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("chat-close");
  const chatWindow = document.getElementById("chat-window");
  const messagesEl = document.getElementById("chat-messages");
  const inputEl = document.getElementById("chat-input");
  const sendBtn = document.getElementById("chat-send");

  let conversationHistory = [];
const catAvatar = document.getElementById("cat-avatar");

toggleBtn.addEventListener("click", () => {
  chatWindow.classList.toggle("open");
  catAvatar.classList.toggle("visible");
});
closeBtn.addEventListener("click", () => {
  chatWindow.classList.remove("open");
  catAvatar.classList.remove("visible");
});

  function addMessage(text, sender) {
    const div = document.createElement("div");
    div.className = "msg " + sender;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  async function sendMessage() {
     resetIdleTimer();
    const text = inputEl.value.trim();
    if (!text) return;
    addMessage(text, "user");
    conversationHistory.push({ role: "user", content: text });
    inputEl.value = "";
    addMessage("Thinking...", "bot");
    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: conversationHistory }),
      });
      const data = await response.json();
      messagesEl.removeChild(messagesEl.lastChild);
      const reply = data.reply || "Sorry, something went wrong.";
      addMessage(reply, "bot");
      conversationHistory.push({ role: "assistant", content: reply });
      speakText(reply);
    } catch (err) {
      messagesEl.removeChild(messagesEl.lastChild);
      addMessage("Couldn't reach the assistant right now.", "bot");
    }
  }
  // ---------- Certifications (data-driven — add new certs here only) ----------
const certifications = [
  {
    name: "AI-900",
    tag: "Microsoft Azure AI Fundamentals",
    status: "done",
    image: "assets/certs/ai-900.png"
  },
  {
    name: "TCS Xceed — Linux",
    tag: "TCS Internal Certification",
    status: "done",
    image: "assets/certs/tcs-xceed-linux.png"
  },
  {
    name: "AZ-104 — Training Course Completed",
    tag: "Koenig Solutions · Exam pending",
    status: "done",
    image: "assets/certs/az-104-training.png"
  },
  {
  name: "GH-200: GitHub Actions",
  tag: "Koenig Solutions · Course Completion",
  status: "done",
  image: "assets/certs/gh-200-github-actions.png"
  },
  {
    name: "AZ-900",
    tag: "In Progress",
    status: "progress",
    image: null
  }
];

function renderCertifications() {
  const certRow = document.getElementById("cert-row");
  certRow.innerHTML = "";

  certifications.forEach(cert => {
    const badge = document.createElement("div");
    badge.className = "cert-badge" + (cert.status === "progress" ? " progress" : "") + (!cert.image ? " no-image" : "");

    badge.innerHTML = `
      <span class="dot"></span>
      <div>
        <div class="cname">${cert.name}</div>
        <div class="ctag">${cert.tag}</div>
      </div>
    `;

    if (cert.image) {
      badge.addEventListener("click", () => openCertModal(cert.image, cert.name));
    }

    certRow.appendChild(badge);
  });
}

function openCertModal(imageSrc, certName) {
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("cert-modal-img");
  modalImg.src = imageSrc;
  modalImg.alt = certName + " certificate";
  modal.classList.add("open");
}

function closeCertModal() {
  document.getElementById("cert-modal").classList.remove("open");
}

document.getElementById("cert-modal-close").addEventListener("click", closeCertModal);
document.getElementById("cert-modal").addEventListener("click", (e) => {
  if (e.target.id === "cert-modal") closeCertModal(); // click outside the image closes it too
});

renderCertifications();

  // ---------- Voice input (speech-to-text) ----------
  const micBtn = document.getElementById("chat-mic");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    micBtn.classList.add("hidden");
  } else {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    let isListening = false;

    micBtn.addEventListener("click", () => {
      if (isListening) { recognition.stop(); return; }
      recognition.start();
    });
    recognition.addEventListener("start", () => { isListening = true; micBtn.classList.add("listening"); });
    recognition.addEventListener("end", () => { isListening = false; micBtn.classList.remove("listening"); });
    recognition.addEventListener("result", (event) => {
      const transcript = event.results[0][0].transcript;
      inputEl.value = transcript;
      sendMessage();
    });
    recognition.addEventListener("error", (event) => {
      isListening = false;
      micBtn.classList.remove("listening");
      console.warn("Speech recognition error:", event.error);
    });
  }

  // ---------- Voice output (text-to-speech) ----------
  

  const catMouth = document.getElementById("cat-mouth");
let mouthInterval = null;

function startTalkingAnimation() {
  catAvatar.classList.add("cat-talking");
  let open = false;
  mouthInterval = setInterval(() => {
    open = !open;
    catMouth.setAttribute("d", open ? "M48 72 Q60 86 72 72" : "M50 74 Q60 78 70 74");
  }, 180);
}

function stopTalkingAnimation() {
  catAvatar.classList.remove("cat-talking");
  clearInterval(mouthInterval);
  catMouth.setAttribute("d", "M50 74 Q60 78 70 74");
}

async function speakText(text) {
  try {
    startTalkingAnimation();

    const response = await fetch(WORKER_URL + "/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
    });

    if (!response.ok) {
      stopTalkingAnimation();
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    audio.onended = stopTalkingAnimation;
    audio.onerror = stopTalkingAnimation;

    audio.play();
  } catch (err) {
    stopTalkingAnimation();
    console.warn("Speech playback failed:", err);
  }
}
// ---------- Idle yawn: plays once if no activity for a while ----------
let idleTimer = null;
const IDLE_YAWN_DELAY = 45000; // 45 seconds

function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (catAvatar.classList.contains("visible") && !catAvatar.classList.contains("cat-talking")) {
      catAvatar.classList.add("cat-yawning");
      setTimeout(() => catAvatar.classList.remove("cat-yawning"), 1300);
    }
    resetIdleTimer(); // schedule the next possible yawn
  }, IDLE_YAWN_DELAY);
}
resetIdleTimer();

  sendBtn.addEventListener("click", sendMessage);
  inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
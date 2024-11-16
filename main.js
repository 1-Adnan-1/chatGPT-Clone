//! HTML İmport.
const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const defaultText = document.querySelector(".default-text");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;

const creatElement = (html, className) => {
  // * Yeni div oluştu bu dive chat ve dışardan gelen classı ver.
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  // * bu dive dışardan gelen html parametresini ekle.
  chatDiv.innerHTML = html;

  return chatDiv;
};

const getChatResponse = async (incomingChatDiv) => {
  // * Api den gelen cevabı p etiketine verdim.
  const pElement = document.createElement("p");
  console.log(pElement);
  // *1 Url i tanımla.
  const url = "https://chatgpt-42.p.rapidapi.com/geminipro";
  // *2 optionsu Tanımla.
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "c0f6459d13mshcb2e3fd751905cfp150deejsn90c1210a75e4",
      "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: `${userText}`,
        },
      ],
      temperature: 0.9,
      top_k: 5,
      top_p: 0.9,
      max_tokens: 256,
      web_access: false,
    }),
  };
  try {
    // * Apı ye istek at ve bekle.
    const response = await fetch(url, options);
    // * cevabı jsona çevir ve bekle.
    const result = await response.json();
    //* Apiden gelen cevabı p etiketine aktardım.
    pElement.innerHTML = result.result;
  } catch (error) {
    console.log(error);
  }
  console.log(incomingChatDiv);
  // * animasyonu kaldırdım.
  incomingChatDiv.querySelector(".typing-animation").remove();
  incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
  chatInput.value = null;
};

const showTypingAnimation = () => {
  const html = `
        <div class="chat-content">
          <div class="chat-details">
            <img src="./images/chatbot.jpg" alt="" />
            <div class="typing-animation">
              <div class="typing-dot" style="--delay: 0.2s"></div>
              <div class="typing-dot" style="--delay: 0.3s"></div>
              <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
          </div>
        </div>
  `;
  const incomingChatDiv = creatElement(html, "incoming");
  chatContainer.appendChild(incomingChatDiv);
  getChatResponse(incomingChatDiv);
};

const handleOutGoingChat = () => {
  userText = chatInput.value.trim(); //* İnputtaki değeri al.
  // * inputta veri yoksa fonksiyonu durdur.
  if (!userText) {
    alert("Bir veri giriniz!!!");
    return;
  }
  const html = `
  <div class="chat-content">
          <div class="chat-details">
            <img src="./images/user.jpg" alt="" />
            <p></p>
          </div>
        </div> 
        `;
  // Kullanıcının mesajını chatContainer yapısına ekle.
  const outgoingChatDiv = creatElement(html, "outgoing");
  defaultText.remove();
  outgoingChatDiv.querySelector("p").textContent = userText;
  chatContainer.appendChild(outgoingChatDiv);
  chatContainer.appendChild(outgoingChatDiv);
  setTimeout(showTypingAnimation, 500);
};
//! Olay İzleyiciler.
sendButton.addEventListener("click", handleOutGoingChat);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleOutGoingChat();
  }
});
themeButton.addEventListener("click", (e) => {
  document.body.classList.toggle("light-mode");
  themeButton.innerText = document.body.classList.contains("light-mode")
    ? "dark_mode"
    : "light_mode";
});

deleteButton.addEventListener("click", () => {
  if (confirm("Tüm sohbetleri silmek istediğinize eminmisiniz ?")) {
    chatContainer.remove();
  }

  const defaultText = `
  <div class="default-text">
      <h1>ChatGPT Clone</h1>
    </div>
     <div class="chat-container"></div>
      <div class="typing-container">
      <div class="typing-content">
        <div class="typing-textarea">
          <textarea
            id="chat-input"
            placeholder="Aratmak istediğiniz veriyi giriniz..."
          ></textarea>
          <span class="material-symbols-outlined" id="send-btn"> send </span>
        </div>
        <div class="typing-controls">
          <span class="material-symbols-outlined" id="theme-btn">
            light_mode
          </span>
          <span class="material-symbols-outlined" id="delete-btn">
            delete
          </span>
        </div>
      </div>
    </div>
  `;
  document.body.innerHTML = defaultText;
});

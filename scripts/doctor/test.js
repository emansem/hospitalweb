
  
  
  async function messageDetails() {
    try {
      const { data, error } = await supabase.from("unique_chatID").select("*").eq("doctorid", loggedUser);
      if (error) throw error;
      if (data && data.length !== 0) {
        console.log("the inserting for a id", data);
      }
      const messageInput = messageForm.messageInput.value;
      if (messageInput === "") {
        chatwindow.innerHTML = `You cannot submit a empty message`;
        return;
      }
      const message = {
        senderID: loggedUser,
        receiverID: doctorID,
        message: messageInput,
        chatID: data[0].id,
        payID: data[0].pay_id,
      };
      await sendNewMessage(message);
    } catch (error) {
      console.error("Error in messageDetails:", error);
    }
  }
  
  async function sendNewMessage(message) {
    try {
      const { data, error } = await supabase.from("chat_room").insert([message]).select();
      if (error) throw error;
      if (data && data.length !== 0) {
        console.log(data);
        appendMessages(data[0]);
        messageForm.messageInput.value = "";
      } else {
        console.log("no data here");
      }
    } catch (error) {
      console.error("Error sending new message:", error);
    }
  }
  
  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    messageDetails();
  });
  
  async function receiveNewMessage() {
    supabase
      .channel("chat_room")
      .on("INSERT", (payload) => {
        console.log("new message", payload.new);
        localSaveMessage.push(payload.new);
        appendMessages(payload.new);
        fetchMessagesFromServer();
      })
      .subscribe();
  }
  
  function appendMessages(message) {
    const messageElement = document.createElement("div");
    messageElement.className = message.senderID === loggedUser ? "message sender" : "message receiver";
    messageElement.innerText = message.message;
    chatwindow.appendChild(messageElement);
    chatwindow.scrollTop = chatwindow.scrollHeight;
  }
  
  function renderMessages(messages) {
    console.log(messages);
    messages.forEach((message) => {
      appendMessages(message);
    });
  }
  
  async function fetchMessagesFromServer(payID, chatID, date) {
    try {
      const { data, error } = await supabase.from("chat_room").select("*").order("time", { ascending: true });
      if (error) throw error;
      validateMessages(data, payID, chatID, date);
      console.log("this is the messages from the server", data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }
  
  function validateMessages(data, payID, chatID, date) {
    if (data && data.length !== 0) {
      const messageFilter = data.filter(
        (message) => message.payID === payID && message.chatID === chatID
      );
      if (messageFilter.length === 0) {
        chatwindow.innerHTML = `Start a new chat with the doctor`;
      } else if (Date.now() > date) {
        chatwindow.innerHTML = `Time Up With the `;
        chatInput.setAttribute("readonly", true);
        sendBtn.disabled = true;
        sendBtn.style.background = "#ccc";
      } else {
        renderMessages(messageFilter);
      }
    } else {
      chatwindow.innerHTML = `Click the window to start chatting`;
    }
  }
  
  async function getNewChatId() {
    try {
      const { data, error } = await supabase.from("unique_chatID").select("*").eq("doctorid", loggedUser);
      if (error) throw error;
      if (data && data.length !== 0) {
        const chatID = data[0].id;
        const payID = data[0].pay_id;
        const date = data[0].expireDate;
        await fetchMessagesFromServer(payID, chatID, date);
      }
    } catch (error) {
      console.error("Error fetching new chat ID:", error);
    }
  }
  
  getNewChatId();
  receiveNewMessage();
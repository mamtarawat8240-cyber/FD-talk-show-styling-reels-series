
// Test Backend Connection
const backendBtn = document.getElementById("backendBtn");
const backendStatus = document.getElementById("backendStatus");

backendBtn.addEventListener("click", async function () {
    backendStatus.textContent = "Connecting to backend...";

    try {
        const response = await fetch("http://localhost:3000/api/status");
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Backend request failed.");
        }

        backendStatus.textContent =
            data.message || "Backend connected successfully!";
    } catch (error) {
        backendStatus.textContent =
            "Connection failed. Please check your backend server.";
    }
});

// Contact Form
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");
const sendBtn = document.getElementById("sendBtn");

contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        contactStatus.textContent = "Please fill in all fields.";
        return;
    }

    sendBtn.disabled = true;
    contactStatus.textContent = "Sending your message...";

    try {
        const response = await fetch("http://localhost:3000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not send message.");
        }

        contactStatus.textContent =
            data.message || "Your message was sent successfully!";

        contactForm.reset();
    } catch (error) {
        contactStatus.textContent =
            "Message could not be sent. Check that the backend is running.";
    } finally {
        sendBtn.disabled = false;
    }
});
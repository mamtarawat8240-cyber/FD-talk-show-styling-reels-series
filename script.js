
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

// Auth UI (login/signup state)
(function () {
    const user = (function () {
        try {
            return JSON.parse(localStorage.getItem("fdUser"));
        } catch (e) {
            return null;
        }
    })();

    const nav = document.querySelector("nav");
    if (!nav) return;

    if (user && user.name) {
        const greeting = document.createElement("span");
        greeting.textContent = "Hi, " + user.name;
        greeting.style.cssText = "color:#a91b61;font-weight:bold;padding:8px 12px;";
        nav.appendChild(greeting);

        const logout = document.createElement("a");
        logout.href = "#";
        logout.textContent = "Logout";
        logout.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("fdUser");
            window.location.reload();
        });
        nav.appendChild(logout);
    }
})();


// Live Survey Results Sync (MongoDB Atlas)
(async function syncSurveyResults() {
    try {
        const response = await fetch("http://localhost:3000/api/survey-results");
        if (!response.ok) return;
        const result = await response.json();
        if (result && result.status === "success" && result.data) {
            console.log("Survey data synced from MongoDB:", result.source, "Total:", result.totalResponses);
            const totalStat = document.querySelector(".survey-stat-number");
            if (totalStat && result.totalResponses) {
                totalStat.textContent = result.totalResponses;
            }
        }
    } catch (e) {
        // Fallback: Static analysis in HTML is already pre-rendered
    }
})();

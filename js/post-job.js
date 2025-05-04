// ✅ Firebase config (reused)
const firebaseConfig = {
    apiKey: "AIzaSyAY23TNxCSB8N_qn6CyxkbOe4Tg0cA-4FI",
    authDomain: "rampurrozgaar.firebaseapp.com",
    projectId: "rampurrozgaar",
    storageBucket: "rampurrozgaar.firebasestorage.app",
    messagingSenderId: "585337248320",
    appId: "1:585337248320:web:19acb7cb8e01dd88de5da5"
};

// ✅ Initialize Firebase only once
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ✅ Form logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('postJobForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const data = {
            company: document.getElementById('company').value,
            name: document.getElementById('name').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            whatsapp: document.getElementById('whatsapp').value,
            type: document.getElementById('type').value,
            location: document.getElementById('location').value,
            category: document.getElementById('category').value,
            featured: false,
            date_line: new Date().toISOString().split("T")[0]
        };

        try {
            await db.collection('jobs').add(data);
            alert("✅ Job Posted Successfully!");
            form.reset();
        } catch (error) {
            console.error("❌ Error posting job:", error);
            alert("Something went wrong. Try again.");
        }
    });
});

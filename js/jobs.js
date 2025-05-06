// ✅ Firebase v8 Config
const firebaseConfig = {
    apiKey: "AIzaSyAY23TNxCSB8N_qn6CyxkbOe4Tg0cA-4FI",
    authDomain: "rampurrozgaar.firebaseapp.com",
    projectId: "rampurrozgaar",
    storageBucket: "rampurrozgaar.firebasestorage.app",
    messagingSenderId: "585337248320",
    appId: "1:585337248320:web:19acb7cb8e01dd88de5da5"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let recaptchaVerifier;

window.addEventListener('load', () => {
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
    });
});

async function loadJobs(category = '', location = '', tabCategory = '') {
    const snapshot = await db.collection("jobs").get();
    const results = [];

    snapshot.forEach(doc => {
        const job = { id: doc.id, ...doc.data() };
        const catMatch = category ? job.category?.toLowerCase().includes(category.toLowerCase()) : true;
        const locMatch = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;
        const tabCategoryMatch = tabCategory ? job.type?.toLowerCase().includes(tabCategory.toLowerCase()) : true;

        if (catMatch && locMatch && tabCategoryMatch) {
            results.push(job);
        }
    });

    const container = document.getElementById('job-listings');
    if (results.length === 0) {
        container.innerHTML = "<p>No jobs found.</p>";
        return;
    }
    container.innerHTML = '';

    const userPhone = localStorage.getItem("userPhone") || "";

    results.forEach(job => {
        const docId = `${job.id}_${userPhone.replace('+91', '')}`;
        const hasApplied = localStorage.getItem(`applied_${docId}`) === "true";

        const applyBtnHtml = hasApplied
            ? `<button class="btn btn-success" disabled>Applied</button>`
            : `<a class="btn btn-primary apply-now-btn" data-id="${job.id}" data-phone="${job.whatsapp}" href="#">Apply Now</a>`;

        const jobHtml = `
          <div class="job-item p-4 mb-4">
              <div class="row g-4">
                  <div class="col-sm-12 col-md-8 d-flex align-items-center">
                      <img class="flex-shrink-0 img-fluid border rounded" src="${job.image}" alt="" style="width: 80px; height: 80px;">
                      <div class="text-start ps-4">
                          <h5 class="mb-1">${job.title} ${job.featured ? '<i class="fa fa-star text-warning ms-2" title="Featured"></i>' : ''}</h5>
                          <small class="d-block mb-1">${job.company}</small>
                          <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}</span>
                          <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${job.type}</span>
                          <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
                      </div>
                  </div>
                  <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                      <div class="d-flex mb-3">
                          <a class="btn btn-light btn-square me-3" href="https://wa.me/${job.whatsapp}" target="_blank">
                              <i class="fab fa-whatsapp text-success"></i>
                          </a>
                          ${applyBtnHtml}
                      </div>
                      <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Apply By: ${job.date_line}</small>
                  </div>
              </div>
          </div>
        `;

        container.innerHTML += jobHtml;
    });
}


async function loadFeaturedJobs() {
    const snapshot = await db.collection("jobs").where("featured", "==", true).get();
    const container = document.getElementById('job-listings');

    if (snapshot.empty) {
        container.innerHTML = "<p>No featured jobs found.</p>";
        return;
    }

    container.innerHTML = '';
    const userPhone = localStorage.getItem("userPhone") || "";

    snapshot.forEach(doc => {
        const job = { id: doc.id, ...doc.data() };
        const docId = `${job.id}_${userPhone.replace('+91', '')}`;
        const hasApplied = localStorage.getItem(`applied_${docId}`) === "true";

        const applyBtnHtml = hasApplied
            ? `<button class="btn btn-success" disabled>Applied</button>`
            : `<a class="btn btn-primary apply-now-btn" data-id="${job.id}" data-phone="${job.whatsapp}" href="#">Apply Now</a>`;

        const jobHtml = `
          <div class="job-item p-4 mb-4">
              <div class="row g-4">
                  <div class="col-sm-12 col-md-8 d-flex align-items-center">
                      <img class="flex-shrink-0 img-fluid border rounded" src="${job.image}" alt="" style="width: 80px; height: 80px;">
                      <div class="text-start ps-4">
                          <h5 class="mb-1">${job.title} <i class="fa fa-star text-warning ms-2" title="Featured"></i></h5>
                          <small class="d-block mb-1">${job.company}</small>
                          <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}</span>
                          <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${job.type}</span>
                          <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
                      </div>
                  </div>
                  <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
                      <div class="d-flex mb-3">
                          <a class="btn btn-light btn-square me-3" href="https://wa.me/${job.whatsapp}" target="_blank">
                              <i class="fab fa-whatsapp text-success"></i>
                          </a>
                          ${applyBtnHtml}
                      </div>
                      <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Apply By: ${job.date_line}</small>
                  </div>
              </div>
          </div>
        `;
        container.innerHTML += jobHtml;
    });
}



// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    // seedAllCategoriesAndLocations();
    // deleteAllJobs();
    loadFeaturedJobs();
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('click', function () {
            const category = this.getAttribute('data-category');
            const urlParams = new URLSearchParams(window.location.search);
            const location = urlParams.get('location') || '';
            const _category = urlParams.get('category') || '';

            if (category === 'featured') {
                loadFeaturedJobs(); // special case
            } else {
                loadJobs(_category, location, category); // pass both category and location
            }
        });
    });
});

async function deleteAllJobs() {
    const snapshot = await db.collection("jobs").get();
    const batch = db.batch();

    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("🗑️ All jobs deleted.");
}


async function seedAllCategoriesAndLocations() {
    const categories = [
        "फ्लायर बांटने वाला / प्रचारक",
        "फोन / व्हाट्सएप सपोर्ट",
        "ऑफिस असिस्टेंट / रिसेप्शनिस्ट",
        "डिलीवरी बॉय / फील्ड स्टाफ",
        "सैलून वर्कर / ब्यूटीशियन",
        "घर की सफाई / बाई / क्लीनर",
        "ट्यूटर / पढ़ाई सहायक",
        "मजदूर / हेल्पर"
    ];

    const locations = [
        "सिविल लाइंस",
        "शादी खाना",
        "बिलासपुर रोड",
        "गांधी समाधि",
        "नवाब गंज",
        "आजाद नगर",
        "शाहबाद गेट",
        "रेलवे कॉलोनी"
    ];

    const types = ["Full Time", "Part Time"];
    const images = [
        "img/com-logo-1.jpg",
        "img/com-logo-2.jpg",
        "img/com-logo-3.jpg",
        "img/com-logo-4.jpg"
    ];

    const sampleCompanies = [
        "Rampur Services Pvt. Ltd.",
        "Zahid Traders",
        "Star Solutions",
        "GreenCare Agency",
        "Smart Classes",
        "Sapphire Salon",
        "Bright Minds Coaching",
        "Helping Hands Labor"
    ];

    for (let i = 0; i < categories.length; i++) {
        const job = {
            title: `Job for ${categories[i]}`,
            company: sampleCompanies[i % sampleCompanies.length],
            category: categories[i],
            type: types[i % 2],
            featured: i % 2 === 0,
            location: locations[i % locations.length],
            salary: `₹${4000 + i * 1000}–₹${6000 + i * 1000}`,
            date_line: `${12 + i} May, 2025`,
            whatsapp: `91${Math.floor(9000000000 + Math.random() * 100000000)}`,
            image: images[i % images.length],
            description: `Detailed description for ${categories[i]}.`
        };

        await db.collection("jobs").add(job);
        console.log(`✅ Added: ${job.title} in ${job.location}`);
    }

    console.log("🎉 All categories and locations seeded successfully.");
}

let applyPhone = null;
let applyJobId = null;

function checkAndApply(jobId, phone) {
    const isVerified = localStorage.getItem("isPhoneVerified");
    if (isVerified === "true") {
        window.open(`https://wa.me/${phone}`, "_blank");
    } else {
        applyPhone = phone;
        applyJobId = jobId;
        const modal = new bootstrap.Modal(document.getElementById('otpModal'));
        modal.show();
    }
}

function sendOTP() {
    const number = "+91" + document.getElementById("phoneInput").value;

    if (!recaptchaVerifier) {
        alert("Recaptcha not ready. Please refresh the page.");
        return;
    }

    firebase.auth().signInWithPhoneNumber(number, recaptchaVerifier)
        .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            alert("OTP sent to " + number);
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
}

function verifyOTP() {
    const code = document.getElementById("otpInput").value;

    if (!window.confirmationResult) {
        alert("OTP not sent yet. Please enter your phone and click 'Send OTP' first.");
        return;
    }

    window.confirmationResult.confirm(code).then(async (result) => {
        const userPhone = result.user.phoneNumber;
        localStorage.setItem("isPhoneVerified", "true");
        localStorage.setItem("userPhone", userPhone);
        alert("📲 Phone verified!");

        // Hide OTP modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('otpModal'));
        modal.hide();

        if (applyPhone && applyJobId) {
            const applicationDocId = `${applyJobId}_${userPhone.replace('+91', '')}`;

            const applicationRef = db.collection("job_applications").doc(applicationDocId);

            try {
                // 🔍 Check if this user already applied for this job
                const docSnapshot = await applicationRef.get();

                if (docSnapshot.exists) {
                    alert("⚠️ You have already applied for this job.");
                    return;
                }

                // ✅ Create user doc if not exists
                await db.collection("users").doc(userPhone).set({
                    phone: userPhone
                }, { merge: true });

                // ✅ Save the application
                await applicationRef.set({
                    jobId: applyJobId,
                    phone: userPhone,
                    appliedTo: applyPhone,
                    appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: "scheduled"
                });

                // ✅ Optionally update job doc (track currently interviewing)
                await db.collection("jobs").doc(applyJobId).update({
                    currentlyInterviewing: firebase.firestore.FieldValue.arrayUnion(userPhone)
                });

                localStorage.setItem(`applied_${applicationDocId}`, "true");

                alert("✅ Application submitted successfully!");

                // 🔗 Open WhatsApp link
                window.open(`https://wa.me/${applyPhone}`, "_blank");

            } catch (err) {
                console.error("❌ Failed to save application:", err);
                alert("Something went wrong. Please try again.");
            }
        }
    }).catch((error) => {
        console.error("❌ OTP verification failed:", error);
        alert("Wrong OTP. Please try again.");
    });
}


document.addEventListener('click', function (e) {
    if (e.target && e.target.classList.contains('apply-now-btn')) {
        e.preventDefault();
        const jobId = e.target.getAttribute('data-id');
        const phone = e.target.getAttribute('data-phone');
        checkAndApply(jobId, phone);
    }
});

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

async function loadJobs(category = '', location = '', tabCategory = '') {
    const snapshot = await db.collection("jobs").get();
    const results = [];

    snapshot.forEach(doc => {
        const job = doc.data();
        const catMatch = category ? job.category?.toLowerCase().includes(category.toLowerCase()) : true;
        const locMatch = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;
        const tabCategoryMatch = location ? job.type?.toLowerCase().includes(tabCategory.toLowerCase()) : true;

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

    results.forEach(job => {
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
                          <a class="btn btn-primary" href="https://wa.me/${job.whatsapp}" target="_blank">Apply Now</a>
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
    snapshot.forEach(doc => {
        const job = doc.data();
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
                          <a class="btn btn-primary" href="https://wa.me/${job.whatsapp}" target="_blank">Apply Now</a>
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


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

async function loadJobs(category = '', location = '') {
  const snapshot = await db.collection("jobs").get();
  const results = [];

  snapshot.forEach(doc => {
      const job = doc.data();
      const catMatch = category ? job.category?.toLowerCase().includes(category.toLowerCase()) : true;
      const locMatch = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;

      if (catMatch && locMatch) {
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

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get('category') || '';
  const loc = urlParams.get('location') || '';
  loadJobs(cat, loc);
});

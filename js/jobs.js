
const jobs = [
    {
        title: "Delivery Boy / डिलीवरी बॉय",
        company: "Jain Kirana Store",
        location: "Civil Lines, Rampur",
        type: "Full Time",
        salary: "₹8,000–₹10,000",
        date_line: "10 May, 2025",
        image: "img/com-logo-1.jpg",
        whatsapp: "919876543210"
    },
    {
        title: "Shop Helper / दुकान सहायक",
        company: "Gupta General Store",
        location: "Shahbad Gate, Rampur",
        type: "Full Time",
        salary: "₹6,500–₹9,000",
        date_line: "11 May, 2025",
        image: "img/com-logo-2.jpg",
        whatsapp: "919812345678"
    },
    {
        title: "Office Receptionist / ऑफिस रिसेप्शनिस्ट",
        company: "Dr. Khan Clinic",
        location: "Gandhi Samadhi, Rampur",
        type: "Part Time",
        salary: "₹4,000–₹6,000",
        date_line: "12 May, 2025",
        image: "img/com-logo-3.jpg",
        whatsapp: "919877654321"
    },
    {
        title: "Delivery Executive / पार्सल डिलीवरी",
        company: "Local Courier Service",
        location: "Near Katghar, Rampur",
        type: "Full Time",
        salary: "₹10,000–₹12,000",
        date_line: "15 May, 2025",
        image: "img/com-logo-4.jpg",
        whatsapp: "919844556677"
    },
    {
        title: "Flyer Distributor / प्रचारक",
        company: "Shiksha Academy",
        location: "Railway Station Road, Rampur",
        type: "Part Time",
        salary: "₹3,000–₹5,000",
        date_line: "13 May, 2025",
        image: "img/com-logo-5.jpg",
        whatsapp: "919811223344"
    }
];

const jobListingsContainer = document.getElementById("job-listings");

jobs.forEach(job => {
    const jobHtml = `
        <div class="job-item p-4 mb-4">
          <div class="row g-4">
            <div class="col-sm-12 col-md-8 d-flex align-items-center">
              <img class="flex-shrink-0 img-fluid border rounded" src="${job.image}" alt="" style="width: 80px; height: 80px;">
              <div class="text-start ps-4">
                <h5 class="mb-1">${job.title}</h5>
                <small class="d-block mb-1">${job.company}</small>
                <span class="text-truncate me-3"><i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}</span>
                <span class="text-truncate me-3"><i class="far fa-clock text-primary me-2"></i>${job.type}</span>
                <span class="text-truncate me-0"><i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}</span>
              </div>
            </div>
            <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
              <div class="d-flex mb-3">
                <a class="btn btn-light btn-square me-3" href="https://wa.me/${job.whatsapp}" target="_blank"><i class="fab fa-whatsapp text-success"></i></a>
                <a class="btn btn-primary" href="https://wa.me/${job.whatsapp}" target="_blank">Apply Now</a>
              </div>
              <small class="text-truncate"><i class="far fa-calendar-alt text-primary me-2"></i>Apply By: ${job.date_line}</small>
            </div>
          </div>
        </div>
      `;
    jobListingsContainer.innerHTML += jobHtml;
});
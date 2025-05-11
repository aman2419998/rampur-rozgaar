async function loadJobs(category = '', location = '', tabCategory = '') {
    const snapshot = await db.collection("jobs").get();
    renderJobList(snapshot, category, location, tabCategory);
}

async function loadFeaturedJobs() {
    const snapshot = await db.collection("jobs").where("featured", "==", true).get();
    renderJobList(snapshot);
}

function renderJobList(snapshot, category = '', location = '', tabCategory = '') {
    const container = document.getElementById('job-listings');
    container.innerHTML = '';
    const userPhone = localStorage.getItem("userPhone") || "";
    const results = [];

    snapshot.forEach(doc => {
        const job = { id: doc.id, ...doc.data() };
        const catMatch = category ? job.category?.toLowerCase().includes(category.toLowerCase()) : true;
        const locMatch = location ? job.location?.toLowerCase().includes(location.toLowerCase()) : true;
        const tabMatch = tabCategory ? job.type?.toLowerCase().includes(tabCategory.toLowerCase()) : true;

        if (catMatch && locMatch && tabMatch) results.push(job);
    });

    if (!results.length) {
        container.innerHTML = "<p>No jobs found.</p>";
        return;
    }

    results.forEach(job => {
        const docId = `${job.id}_${userPhone.replace('+91', '')}`;
        const currentlyInterviewing = job.currentlyInterviewing || [];
        const isInQueue = currentlyInterviewing.includes(userPhone);
        const isQueueFull = currentlyInterviewing.length > 0;

        const applyBtnHtml = isInQueue
            ? `<button class="btn btn-success" disabled>Already Applied</button>`
            : isQueueFull
                ? `<button class="btn btn-warning" disabled>Booked</button>`
                : `<a class="btn btn-primary apply-now-btn" data-id="${job.id}" data-phone="${job.whatsapp}" href="#">Apply Now</a>`;

        container.innerHTML += `
        <div class="job-item p-4 mb-4">
            <div class="row g-4">
                <div class="col-sm-12 col-md-8 d-flex align-items-center">
                    <img class="img-fluid border rounded" src="${job.image}" style="width: 80px; height: 80px;">
                    <div class="text-start ps-4">
                        <h5>${job.title} ${job.featured ? '<i class="fa fa-star text-warning"></i>' : ''}</h5>
                        <small>${job.company}</small>
                        <span><i class="fa fa-map-marker-alt text-primary"></i> ${job.location}</span>
                        <span><i class="far fa-clock text-primary"></i> ${job.type}</span>
                        <span><i class="far fa-money-bill-alt text-primary"></i> ${job.salary}</span>
                    </div>
                </div>
                <div class="col-sm-12 col-md-4 d-flex flex-column align-items-end justify-content-center">
                    <div class="d-flex mb-3">
                        <a class="btn btn-light btn-square me-3" href="https://wa.me/${job.whatsapp}" target="_blank">
                            <i class="fab fa-whatsapp text-success"></i>
                        </a>
                        ${applyBtnHtml}
                    </div>
                    <small><i class="far fa-calendar-alt text-primary me-2"></i>Apply By: ${job.date_line}</small>
                </div>
            </div>
        </div>
        `;
    });
}

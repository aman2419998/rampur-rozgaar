function checkAndApply(jobId, phone) {
    const isVerified = localStorage.getItem("isPhoneVerified") === "true";
    const userPhone = localStorage.getItem("userPhone") || "";
    const applicationDocId = `${jobId}_${userPhone.replace('+91', '')}`;
    const hasApplied = localStorage.getItem(`applied_${applicationDocId}`) === "true";

    applyPhone = phone;
    applyJobId = jobId;

    if (!isVerified) {
        const modal = new bootstrap.Modal(document.getElementById('otpModal'));
        modal.show();
    } else if (!hasApplied) {
        simulateVerifiedApplyFlow(userPhone);
    } else {
        window.open(`https://wa.me/${phone}`, "_blank");
    }
}

async function simulateVerifiedApplyFlow(userPhone) {
    const applicationDocId = `${applyJobId}_${userPhone.replace('+91', '')}`;
    const applicationRef = db.collection("job_applications").doc(applicationDocId);

    await db.collection("users").doc(userPhone).set({ phone: userPhone }, { merge: true });

    await applicationRef.set({
        jobId: applyJobId,
        phone: userPhone,
        appliedTo: applyPhone,
        appliedAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "scheduled"
    });

    await db.collection("jobs").doc(applyJobId).update({
        currentlyInterviewing: firebase.firestore.FieldValue.arrayUnion(userPhone)
    });

    localStorage.setItem(`applied_${applicationDocId}`, "true");
    window.open(`https://wa.me/${applyPhone}`, "_blank");
}

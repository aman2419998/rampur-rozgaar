let recaptchaVerifier;
let applyPhone = null;
let applyJobId = null;

window.addEventListener('load', () => {
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible'
    });
});

function sendOTP() {
    const number = "+91" + document.getElementById("phoneInput").value;

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

    if (!window.confirmationResult) return alert("Send OTP first.");

    window.confirmationResult.confirm(code).then(async (result) => {
        const userPhone = result.user.phoneNumber;
        localStorage.setItem("isPhoneVerified", "true");
        localStorage.setItem("userPhone", userPhone);

        const modal = bootstrap.Modal.getInstance(document.getElementById('otpModal'));
        modal.hide();

        await simulateVerifiedApplyFlow(userPhone);
        location.reload();
    }).catch(() => alert("Wrong OTP"));
}

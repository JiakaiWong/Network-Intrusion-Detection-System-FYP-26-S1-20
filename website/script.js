window.showLogin = showLogin;
window.closeModal = closeModal;
window.showRegistrationForm = showRegistrationForm;

function showLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function showRegistrationForm() {
    document.getElementById('registration-modal').style.display = 'block';
    document.getElementById("registration-form").addEventListener("submit", function(e) {
    const password = document.getElementById("registration-password").value;
    const confirm = document.getElementById("confirm-password").value;

        if (password !== confirm) {
            e.preventDefault();
            alert("Passwords do not match!");
        }
    });
}
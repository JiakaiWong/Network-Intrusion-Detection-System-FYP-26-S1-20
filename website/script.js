window.showLogin = showLogin;
window.closeModal = closeModal;
window.showRegistrationForm = showRegistrationForm;

document.addEventListener("DOMContentLoaded", setupEventListeners);


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


// Page navigation

function showLandingPage() {
        document.getElementById('main-content').innerHTML = `
        <!-- Landing Page -->
        <section id="home" class="hero">
            <div class="hero-container">
                <!-- LEFT: Text -->
                <div class="hero-content">
                    <h1>Visualize & Analyze Network Security Threats</h1>
                    <p>Experience the live analyst dashboard</p>
                    <div class="hero-buttons">
                        <button class="btn btn-primary btn-large" onclick="showRegistrationForm()">Register</button>
                        <button class="btn btn-secondary btn-large" onclick="showLogin()">Sign In</button>
                    </div>
                </div>

                <!-- RIGHT: Image -->
                <div class="hero-image-container">
                    <img src="images/securityimage.png" alt="Dashboard Preview" class="hero-image">
                </div>
            </div>
        </section>

        <!-- About us Section -->
        <section id="about" class="about">
            <div class="container">
                <h2>About the Project</h2>
                <div class="about-grid" id="about-grid">
                    <p>A personalised dashboard that alerts you of any undetected threats.</p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact">
            <div class="container">
                <h2>Contact Us</h2>
                <p>Have questions? We're here to help.</p>
                <div class="contact-info">
                    <p>Email: support@gmail.com</p>
                    <p>Location: Singapore</p>
                    <p>Phone: +65 0000 1111 </p>
                </div>
            </div>
        </section>
    `;
}

function showAnalystdashboard() {

}

function showAdminDashboard() {

}

// Set up password check
function handleLogin(e) {
    e.preventDefault();

    // Close the login modal popup
    closeModal('login-modal');

    // Remove this when roles are implemented
    currentUser = {id: 1, role: 'user'};

    // Redirect user to their dashboard
    showDashboard();

    // Show success message
    showSuccess('Login successful!');
}

// Different dashboard based on different roles, for now role will be user
function showDashboard() {
    const content = document.getElementById('main-content');
    
    switch(currentUser.role) {
        case 'visitor':
            showLandingPage();
            break;
        case 'user':
            showUserDashboard();
            break;
        case 'admin':
            showAdminDashboard();
            break;
    }
}


// Volunteer Dashboard Functions
function showUserDashboard() {
    const content = document.getElementById('main-content');
        
    // Update the authentication section of the navigation bar
    // (This is the top-right area where login/logout info usually appears)
    document.getElementById('nav-auth').innerHTML = `
        <span>Welcome, ${currentUser.role}</span>
        <button class="btn btn-outline" onclick="logout()">Logout</button>
    `;
    content.innerHTML = `
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h2>User Alerts</h2>
                <canvas id="pieChart"></canvas>

                <h2>Monthly Activity</h2>
                <canvas id="barChart"></canvas>
            </div>
            <div class="dashboard-card">
            </div>
        </div>
    `;

    
    // Pie Chart

    const ctx = document.getElementById('pieChart');

    new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Safe', 'Warnings', 'Alerts'],
        datasets: [{
        data: [120, 15, 30],
        backgroundColor: ['green', 'orange', 'red']
        }]
    }
    });


    // Bar Chart

    const ctx2 = document.getElementById('barChart');

    new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr'],
        datasets: [{
        label: 'Logins',
        data: [10, 25, 18, 30]
        }]
    }
    });
}

function logout() {
    showLandingPage();
    //currentUser = null;
    document.getElementById('nav-auth').innerHTML = `
        <button class="btn btn-primary btn-large" onclick="showRegistrationForm()">Register</button>
        <button class="btn btn-secondary btn-large" onclick="showLogin()">Sign In</button>
    `;
}

function handleRegistration() {

}

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    
    const registerForm = document.getElementById('registration-form');
    if (registerForm) {
        registerForm.addEventListener('register', handleRegistration);
    }
}

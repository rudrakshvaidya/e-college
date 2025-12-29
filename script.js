// Hardcoded Data
const DATA = {
  students: [
    {id: 'STU001', name: 'Adnan Patel', dept: 'Computer Science', email: 'adnan@ecollege.edu', year: '3rd', status: 'Active'},
    {id: 'STU002', name: 'Priya Sharma', dept: 'Mathematics', email: 'priya@ecollege.edu', year: '2nd', status: 'Active'},
    {id: 'STU003', name: 'Rahul Kumar', dept: 'Physics', email: 'rahul@ecollege.edu', year: '1st', status: 'Inactive'}
  ],
  courses: [
    {code: 'CS101', name: 'Intro to Programming', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '45/100'},
    {code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Sarah Khan', dept: 'Math', seats: '32/80'},
    {code: 'PHY102', name: 'Physics Lab', faculty: 'Dr. Rajesh Gupta', dept: 'Physics', seats: '28/60'}
  ],
  faculty: [
    {name: 'Dr. Anshul Patel', dept: 'Computer Science', email: 'anshul@ecollege.edu', office: 'CS-207', exp: '14 years'},
    {name: 'Prof. Sarah Khan', dept: 'Mathematics', email: 'sarah@ecollege.edu', office: 'MATH-105', exp: '8 years'},
    {name: 'Dr. Rajesh Gupta', dept: 'Physics', email: 'rajesh@ecollege.edu', office: 'PHY-203', exp: '12 years'}
  ]
};

// Existing auth code + new modal system
document.addEventListener('DOMContentLoaded', function() {
  // [Keep all existing auth code from before]
  const users = {'admin': 'admin123', 'student': 'student123', 'faculty': 'faculty123'};
  
  // Login logic (same as before)
  const loginForm = document.querySelector('body.auth-body form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;
      if (users[username] && users[username] === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', username);
        window.location.href = 'dashboard.html';
      } else {
        alert('❌ Wrong credentials!\nadmin/admin123\nstudent/student123\nfaculty/faculty123');
      }
    });
  }

  // Modal System
  document.querySelectorAll('.btn-primary, .add-btn, .edit-link').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      if (target) showModal(target);
    });
  });

  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', () => hideModal());
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => hideModal());
  });

  // Quick Actions
  document.querySelectorAll('.quick-actions a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.href.split('/').pop();
      showModal(page.replace('.html', '') + '-modal');
    });
  });

  // Protect pages
  if (['dashboard.html', 'students.html', 'courses.html', 'faculty.html', 'settings.html'].some(p => window.location.pathname.includes(p))) {
    if (!localStorage.getItem('loggedIn')) window.location.href = 'index.html';
    else addLogoutBtn();
  }
});

function showModal(modalId) {
  document.getElementById(modalId)?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

function addLogoutBtn() {
  const topbar = document.querySelector('.topbar');
  if (topbar && !document.querySelector('.logout-btn')) {
    const btn = document.createElement('button');
    btn.className = 'btn ghost logout-btn';
    btn.textContent = 'Logout';
    btn.onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
    topbar.appendChild(btn);
  }
}

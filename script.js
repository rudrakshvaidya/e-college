// Role-Based Hardcoded Data
const DATA = {
  students: [
    {id: 'STU001', name: 'Adnan Patel', dept: 'Computer Science', email: 'adnan@ecollege.edu', year: '3rd', status: 'Active'},
    {id: 'STU002', name: 'Priya Sharma', dept: 'Mathematics', email: 'priya@ecollege.edu', year: '2nd', status: 'Active'},
    {id: 'STU003', name: 'Rahul Kumar', dept: 'Physics', email: 'rahul@ecollege.edu', year: '1st', status: 'Active'},
    {id: 'STU004', name: 'Sneha Verma', dept: 'Computer Science', email: 'sneha@ecollege.edu', year: '4th', status: 'Active'}
  ],
  courses: [
    {code: 'CS101', name: 'Intro to Programming', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '45/100', progress: 45},
    {code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Sarah Khan', dept: 'Math', seats: '32/80', progress: 40},
    {code: 'PHY102', name: 'Physics Lab', faculty: 'Dr. Rajesh Gupta', dept: 'Physics', seats: '28/60', progress: 47},
    {code: 'CS202', name: 'Data Structures', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '22/80', progress: 27}
  ],
  faculty: [
    {name: 'Dr. Anshul Patel', dept: 'Computer Science', email: 'anshul@ecollege.edu', office: 'CS-207', exp: '14 years'},
    {name: 'Prof. Sarah Khan', dept: 'Mathematics', email: 'sarah@ecollege.edu', office: 'MATH-105', exp: '8 years'},
    {name: 'Dr. Rajesh Gupta', dept: 'Physics', email: 'rajesh@ecollege.edu', office: 'PHY-203', exp: '12 years'}
  ]
};

const ROLES = {
  'admin': {name: 'Admin', can: ['students', 'courses', 'faculty', 'settings'], color: '#3b82f6'},
  'student': {name: 'Student', can: ['profile'], color: '#10b981'},
  'faculty': {name: 'Faculty', can: ['students', 'courses'], color: '#f59e0b'}
};

const USERS = {
  'admin': 'admin123',
  'student': 'student123', 
  'faculty': 'faculty123'
};

document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  const loggedIn = localStorage.getItem('loggedIn');
  
  // LOGIN
  const loginForm = document.querySelector('.auth-body form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;
      if (USERS[username] && USERS[username] === password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', username);
        window.location.href = 'dashboard.html';
      } else {
        alert('❌ Invalid credentials!\n\n👨‍💼 admin/admin123\n👨‍🎓 student/student123\n👨‍🏫 faculty/faculty123');
      }
    });
    return;
  }

  // PROTECT PAGES
  if (!loggedIn || !user) {
    window.location.href = 'index.html';
    return;
  }

  const role = ROLES[user];
  addRoleHeader(role);
  hideNonAuthorizedPages(role);
  updateDashboardStats();
  
  // PAGE SPECIFIC
  if (document.getElementById('students-table')) renderStudents();
  if (document.getElementById('courses-grid')) renderCourses();
  if (document.getElementById('faculty-grid')) renderFaculty();
});

function addRoleHeader(role) {
  const topbar = document.querySelector('.topbar');
  const roleBadge = document.createElement('div');
  roleBadge.className = 'role-badge';
  roleBadge.style.background = role.color;
  roleBadge.innerHTML = `👨‍${role.name === 'Admin' ? '💼' : role.name === 'Student' ? '🎓' : '🏫'} ${role.name}`;
  roleBadge.style.cssText = `
    padding: 4px 12px; border-radius: 20px; color: white; font-size: 13px; font-weight: 600; margin-left: 16px;
  `;
  topbar.appendChild(roleBadge);
  
  const logout = document.createElement('button');
  logout.className = 'btn ghost logout-btn';
  logout.textContent = 'Logout';
  logout.onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
  topbar.appendChild(logout);
}

function hideNonAuthorizedPages(role) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const page = link.href.split('/').pop().replace('.html', '');
    if (!role.can.includes(page) && page !== 'dashboard') {
      link.style.opacity = '0.4';
      link.style.pointerEvents = 'none';
    }
  });
}

function updateDashboardStats() {
  document.querySelector('.stat-value')?.forEach((el, i) => {
    const stats = [DATA.students.length, DATA.courses.length, DATA.faculty.length, 7];
    el.textContent = stats[i];
  });
}

function renderStudents(filtered = DATA.students) {
  const tbody = document.getElementById('students-table');
  const search = document.getElementById('student-search')?.value.toLowerCase() || '';
  const shown = filtered.filter(s => 
    s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search)
  );
  
  tbody.innerHTML = shown.map(student => `
    <tr>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.dept}</td>
      <td>${student.email}</td>
      <td>${student.year}</td>
      <td><span class="status-badge status-active">${student.status}</span></td>
      <td><a href="#" class="edit-link">Edit</a><a href="#" class="delete-link">Delete</a></td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280;">No students found</td></tr>';
}

// Add to CSS
const style = document.createElement('style');
style.textContent = `
  .role-badge { display: inline-flex; align-items: center; gap: 6px; }
  .nav-link[style*="opacity"]::after { display: none !important; }
  .stat-card { transition: transform 0.2s; }
  .stat-card:hover { transform: translateY(-2px); }
`;
document.head.appendChild(style);

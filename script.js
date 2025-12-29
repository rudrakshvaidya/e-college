const DATA = {
  students: [
    {id: 'STU001', name: 'Adnan Patel', dept: 'Computer Science', email: 'adnan@ecollege.edu', year: '3rd', status: 'Active'},
    {id: 'STU002', name: 'Priya Sharma', dept: 'Mathematics', email: 'priya@ecollege.edu', year: '2nd', status: 'Active'},
    {id: 'STU003', name: 'Rahul Kumar', dept: 'Physics', email: 'rahul@ecollege.edu', year: '1st', status: 'Active'},
    {id: 'STU004', name: 'Sneha Verma', dept: 'Computer Science', email: 'sneha@ecollege.edu', year: '4th', status: 'Active'}
  ],
  courses: [
    {id: 1, code: 'CS101', name: 'Intro to Programming', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '45/100', progress: 45},
    {id: 2, code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Sarah Khan', dept: 'Math', seats: '32/80', progress: 40},
    {id: 3, code: 'PHY102', name: 'Physics Lab', faculty: 'Dr. Rajesh Gupta', dept: 'Physics', seats: '28/60', progress: 47},
    {id: 4, code: 'CS202', name: 'Data Structures', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '22/80', progress: 27}
  ],
  faculty: [
    {id: 1, name: 'Dr. Anshul Patel', dept: 'Computer Science', email: 'anshul@ecollege.edu', office: 'CS-207', exp: '14 years', status: 'Active'},
    {id: 2, name: 'Prof. Sarah Khan', dept: 'Mathematics', email: 'sarah@ecollege.edu', office: 'MATH-105', exp: '8 years', status: 'Active'},
    {id: 3, name: 'Dr. Rajesh Gupta', dept: 'Physics', email: 'rajesh@ecollege.edu', office: 'PHY-203', exp: '12 years', status: 'Active'}
  ]
};

const ROLES = {
  'admin': {name: 'Admin', can: ['dashboard', 'students', 'courses', 'faculty', 'settings'], add: ['students', 'courses', 'faculty']},
  'student': {name: 'Student', can: ['dashboard', 'profile'], add: []},
  'faculty': {name: 'Faculty', can: ['dashboard', 'students', 'courses'], add: []}
};

const USERS = {'admin': 'admin123', 'student': 'student123', 'faculty': 'faculty123'};

document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('user');
  const loggedIn = localStorage.getItem('loggedIn');
  
  if (document.querySelector('.auth-body')) {
    handleLogin();
    return;
  }
  
  if (!loggedIn || !user || !ROLES[user]) {
    window.location.href = 'index.html';
    return;
  }
  
  const role = ROLES[user];
  initRole(role);
  initPage(user);
});

function handleLogin() {
  const form = document.querySelector('form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    
    if (!usernameInput || !passwordInput) {
      alert('Login form error');
      return;
    }
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Login attempt:', username, password); // DEBUG
    
    if (USERS[username] && USERS[password] === password) {
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user', username);
      console.log('Login success, redirecting...'); // DEBUG
      window.location.href = 'dashboard.html';
    } else {
      alert('❌ Wrong credentials!\n\n' +
            '👨‍💼 admin / admin123\n' +
            '👨‍🎓 student / student123\n' +
            '👨‍🏫 faculty / faculty123');
    }
  });
}


function initRole(role) {
  const topbar = document.querySelector('.topbar');
  topbar.innerHTML += `
    <div class="role-badge" style="background: ${role.name === 'Admin' ? '#3b82f6' : role.name === 'Student' ? '#10b981' : '#f59e0b'}; padding: 6px 12px; border-radius: 20px; color: white; font-size: 13px; font-weight: 600; margin-left: auto; display: flex; align-items: center; gap: 6px;">
      ${role.name === 'Admin' ? '👨‍💼' : role.name === 'Student' ? '👨‍🎓' : '👨‍🏫'} ${role.name}
    </div>
    <button class="logout-btn" style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer;">Logout</button>
  `;
  document.querySelector('.logout-btn').onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const page = link.getAttribute('href').split('/').pop().replace('.html', '');
    if (!role.can.includes(page)) {
      link.style.opacity = '0.4';
      link.style.pointerEvents = 'none';
    }
  });
  
  document.querySelectorAll('.add-btn').forEach(btn => {
    const page = btn.dataset.page;
    if (!role.add.includes(page)) {
      btn.style.display = 'none';
    }
  });
}

function initPage(user) {
  updateDashboardStats();
  
  // Students page
  if (document.getElementById('students-table')) {
    renderStudents();
    const studentForm = document.getElementById('student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const newStudent = {
          id: 'STU' + (DATA.students.length + 1).toString().padStart(3, '0'),
          name: formData.get('name'),
          dept: formData.get('dept'),
          email: formData.get('email'),
          year: formData.get('year'),
          status: 'Active'
        };
        DATA.students.unshift(newStudent);
        renderStudents();
        hideModal();
        alert('✅ Student added: ' + newStudent.name);
      });
    }
    const studentSearch = document.getElementById('student-search');
    if (studentSearch) studentSearch.addEventListener('input', renderStudents);
  }
  
  // Courses page
  if (document.getElementById('courses-grid')) {
    renderCourses();
    const courseSearch = document.getElementById('course-search');
    if (courseSearch) courseSearch.addEventListener('input', renderCourses);
  }
  
  // Faculty page
  if (document.getElementById('faculty-grid')) {
    renderFaculty();
  }
}


}

function updateDashboardStats() {
  const stats = [DATA.students.length, DATA.courses.length, DATA.faculty.length, 7];
  document.querySelectorAll('.stat-value').forEach((el, i) => el.textContent = stats[i]);
}

function renderStudents() {
  const tbody = document.getElementById('students-table');
  const search = document.getElementById('student-search')?.value.toLowerCase() || '';
  const filtered = DATA.students.filter(s => 
    s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search)
  );
  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td>${s.id}</td><td>${s.name}</td><td>${s.dept}</td><td>${s.email}</td><td>${s.year}</td>
      <td><span class="status-badge status-active">${s.status}</span></td>
      <td><a href="#" class="edit-link">Edit</a> <a href="#" class="delete-link">Delete</a></td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;padding:40px;color:#6b7280;">No students found</td></tr>';
}

function renderCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;
  
  const search = document.getElementById('course-search')?.value.toLowerCase() || '';
  const filtered = DATA.courses.filter(c => 
    c.name.toLowerCase().includes(search) || c.code.toLowerCase().includes(search)
  );
  
  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#6b7280;">No courses found</div>';
    return;
  }
  
  grid.innerHTML = filtered.map(c => `
    <div class="course-card" style="background:white;border-radius:12px;padding:24px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;">
        <h3 style="margin:0;font-size:18px;font-weight:600;">${c.name}</h3>
        <span style="background:#e0e7ff;color:#4f46e5;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:600;">${c.code}</span>
      </div>
      <p style="margin:8px 0;color:#374151;"><strong>Faculty:</strong> ${c.faculty}</p>
      <p style="margin:8px 0;color:#374151;"><strong>Dept:</strong> ${c.dept}</p>
      <div style="height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden;margin:16px 0;">
        <div style="height:100%;background:linear-gradient(90deg,#10b981,#34d399);border-radius:4px;width:${c.progress}%;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:13px;">
        <span style="color:#6b7280;">${c.seats}</span>
        <span style="font-weight:600;color:#1e293b;">${c.progress}% Complete</span>
      </div>
    </div>
  `).join('');
}
function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function hideModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
  document.body.style.overflow = '';
}

// Close modals on click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal-overlay')) {
    hideModal();
  }
});

// Add student modal button handler
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-btn') && e.target.dataset.target) {
    showModal(e.target.dataset.target);
  }
});

function renderFaculty() {
  const grid = document.getElementById('faculty-grid');
  grid.innerHTML = DATA.faculty.map(f => `
    <div class="faculty-card">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:48px;height:48px;background:#e0e7ff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:600;color:#4f46e5;">${f.name.split(' ').map(n => n[0]).join('')}</div>
        <div>
          <h3 style="margin:0 0 4px 0;font-size:16px;">${f.name}</h3>
          <p style="margin:0;color:#6b7280;font-size:13px;">${f.dept} • ${f.exp}</p>
        </div>
      </div>
      <div style="margin:16px 0 12px 0;">
        <p style="margin:4px 0;font-size:13px;color:#374151;">📧 ${f.email}</p>
        <p style="margin:4px 0;font-size:13px;color:#374151;">🏢 ${f.office}</p>
      </div>
      <span class="status-badge status-active">${f.status}</span>
    </div>
  `).join('');
}


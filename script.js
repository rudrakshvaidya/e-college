// Hardcoded Data
const DATA = {
  students: [
    {id: 'STU001', name: 'Adnan Patel', dept: 'Computer Science', email: 'adnan@ecollege.edu', year: '3rd', status: 'Active'},
    {id: 'STU002', name: 'Priya Sharma', dept: 'Mathematics', email: 'priya@ecollege.edu', year: '2nd', status: 'Active'},
    {id: 'STU003', name: 'Rahul Kumar', dept: 'Physics', email: 'rahul@ecollege.edu', year: '1st', status: 'Inactive'}
  ],
  courses: [
    {code: 'CS101', name: 'Intro to Programming', faculty: 'Dr. Anshul Patel', dept: 'CS', seats: '45/100'},
    {code: 'MATH201', name: 'Calculus II', faculty: 'Prof. Sarah Khan', dept: 'Math', seats: '32/80'}
  ],
  faculty: [
    {name: 'Dr. Anshul Patel', dept: 'Computer Science', email: 'anshul@ecollege.edu', office: 'CS-207', exp: '14 years'},
    {name: 'Prof. Sarah Khan', dept: 'Mathematics', email: 'sarah@ecollege.edu', office: 'MATH-105', exp: '8 years'}
  ]
};

// Auth System
const USERS = {'admin': 'admin123', 'student': 'student123', 'faculty': 'faculty123'};

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. LOGIN FORM
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
        alert('❌ Wrong credentials!\n\nadmin/admin123\nstudent/student123\nfaculty/faculty123');
      }
    });
  }

  // 2. PROTECT PAGES
  if (['dashboard.html', 'students.html', 'courses.html', 'faculty.html', 'settings.html'].some(p => 
      window.location.pathname.includes(p.replace('.html', '')))) {
    if (!localStorage.getItem('loggedIn')) {
      window.location.href = 'index.html';
      return;
    }
    addLogoutBtn();
  }

  // 3. POPULATE STUDENTS TABLE
  if (document.getElementById('students-table')) {
    renderStudents();
  }

  // 4. STUDENT MODAL
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
      alert('✅ Student added successfully!');
    });
  }

  // 5. MODAL BUTTONS
  document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const target = this.dataset.target;
      showModal(target);
    });
  });

  document.querySelectorAll('.close-modal, .modal-overlay').forEach(el => {
    el.addEventListener('click', hideModal);
  });

  // 6. SEARCH
  const searchInput = document.getElementById('student-search');
  if (searchInput) {
    searchInput.addEventListener('input', renderStudents);
  }
});

function renderStudents() {
  const tbody = document.getElementById('students-table');
  const search = document.getElementById('student-search')?.value.toLowerCase() || '';
  
  let html = '';
  DATA.students
    .filter(student => student.name.toLowerCase().includes(search) || student.email.toLowerCase().includes(search))
    .forEach(student => {
      html += `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.dept}</td>
          <td>${student.email}</td>
          <td>${student.year}</td>
          <td><span class="status-badge status-${student.status.toLowerCase()}">${student.status}</span></td>
          <td>
            <a href="#" class="edit-link">Edit</a>
            <a href="#" class="delete-link">Delete</a>
          </td>
        </tr>
      `;
    });
  tbody.innerHTML = html || '<tr><td colspan="7">No students found</td></tr>';
}

function showModal(id) {
  document.getElementById(id)?.classList.add('active');
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
    btn.style.marginLeft = 'auto';
    btn.innerHTML = 'Logout';
    btn.onclick = () => { localStorage.clear(); window.location.href = 'index.html'; };
    topbar.appendChild(btn);
  }
}

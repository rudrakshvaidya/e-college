// Hardcoded auth system
const users = {
  'admin': 'admin123',
  'student': 'student123', 
  'faculty': 'faculty123'
};

document.addEventListener('DOMContentLoaded', function() {
  
  // Login form
  const loginForm = document.querySelector('body.auth-body form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.querySelector('input[type="text"]').value;
      const password = document.querySelector('input[type="password"]').value;
      
      if (users[username] && users[username] === password) {
        // Success - redirect to dashboard
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', username);
        window.location.href = 'dashboard.html';
      } else {
        alert('❌ Wrong username or password!\n\nTry:\nadmin/admin123\nstudent/student123\nfaculty/faculty123');
      }
    });
  }
  
  // Signup form (creates new user)
  const signupForm = document.querySelectorAll('body.auth-body form')[1];
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.querySelectorAll('input[type="text"]')[1]?.value || 'testuser';
      const password = document.querySelectorAll('input[type="password"]')[0]?.value;
      
      if (password && password.length >= 6) {
        users[username] = password;
        alert('✅ Account created! Use: ' + username + '/' + password);
        window.location.href = 'index.html';
      } else {
        alert('❌ Password must be 6+ characters');
      }
    });
  }
  
  // Protect dashboard pages (redirect if not logged in)
  if (window.location.pathname.includes('dashboard') || 
      window.location.pathname.includes('students') || 
      window.location.pathname.includes('courses') ||
      window.location.pathname.includes('faculty') ||
      window.location.pathname.includes('settings')) {
    
    if (!localStorage.getItem('loggedIn')) {
      window.location.href = 'index.html';
    } else {
      // Add logout button to topbar
      const topbar = document.querySelector('.topbar');
      if (topbar && !document.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'btn ghost logout-btn';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.onclick = function() {
          localStorage.clear();
          window.location.href = 'index.html';
        };
        topbar.appendChild(logoutBtn);
      }
    }
  }
});

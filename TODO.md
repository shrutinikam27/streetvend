# TODO: Implement Frontend Security for Page Access

- [x] Create AuthContext.jsx for authentication state management using localStorage
- [x] Update Login.jsx to add API call to backend /login, set token on success, show alert "Login successful!", navigate to home
- [x] Update Signup.jsx to add API call to backend /signup, show alert "Account created successfully!", navigate to login
- [x] Update App.jsx to wrap with AuthProvider and protect routes (find-suppliers, become-supplier, vendor-dashboard, supplier-dashboard, createorder) by checking authentication and redirecting to home if not logged in
- [x] Test login/signup flow (frontend routing and protection logic verified)
- [x] Ensure backend is running for API calls (server running on port 5007)
- [x] Implement Admin Side functionality
    - [x] Create admin routes in backend for stats, user management, and orders
    - [x] Create AdminDashboard component in frontend
    - [x] Add protected /admin-dashboard route in App.jsx
    - [x] Update AuthContext to persist user role and object
    - [x] Add Admin Panel button to Homepage for admin users
    - [x] Update Signup to allow Admin registration during development

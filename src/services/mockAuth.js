/*
  mockAuth.js
  ----------
  This file simulates a backend using localStorage. It lets you:
  - "register" a user
  - "login" (returns a fake token)
  - get current user info
  - logout

  WHY:
  - Backend responsibilities are: user storage, password hashing, email verification, tokens (JWT).
  - We cannot run the backend here, so this simulates the same behavior to teach the frontend flow.
  - When you later add a real backend, you'll replace these functions with API calls (axios).
*/

const USERS_KEY = "demo_users";       // where we store users in localStorage
const TOKEN_KEY = "demo_token";       // where we store the logged-in token
const CURRENT_EMAIL = "demo_current_email"; // store email associated with current token

// small helper: read users array from localStorage
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// write users array back to localStorage
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// simulate a short network latency
function fakeDelay(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
}

const mockAuth = {
  /*
    signup(payload)
    - checks if email exists
    - stores user (in production the BACKEND would hash the password using bcrypt before storing)
    - returns a Promise like an HTTP call would
  */
  async signup({ realName, nickname, college, email, password }) {
    await fakeDelay(); // simulate network call

    const users = loadUsers();
    const existing = users.find((u) => u.email === email.toLowerCase());
    if (existing) {
      // mimic an HTTP 400 response; here we reject to simulate an error
      return Promise.reject({ msg: "Email already registered" });
    }

    // WARNING: For this demo we store the password as-is. DO NOT do this in real apps.
    // The real backend must hash the password (bcrypt) before saving.
    const newUser = {
      realName,
      nickname,
      college,
      email: email.toLowerCase(),
      password,     // insecure here for demo only
      verified: true, // in real app, set to false until OTP/email verification
      createdAt: Date.now(),
    };
    users.push(newUser);
    saveUsers(users);

    // mimic success response payload
    return Promise.resolve({ msg: "Signup successful, please login" });
  },

  /*
    login({email, password})
    - verifies user exists and password matches
    - returns a fake token and the user's nickname
    - in real backend the server returns a JWT; frontend saves it (localStorage/cookie)
  */
  async login({ email, password }) {
    await fakeDelay();

    const users = loadUsers();
    const user = users.find((u) => u.email === email.toLowerCase());
    if (!user) {
      return Promise.reject({ msg: "User not found" });
    }
    if (user.password !== password) {
      return Promise.reject({ msg: "Wrong password" });
    }
    if (!user.verified) {
      return Promise.reject({ msg: "Please verify your email first (simulated)" });
    }

    // Create a fake token. In real systems this is a signed JWT.
    const token = btoa(`${email}:${Date.now()}`); // simple base64 token for demo
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_EMAIL, user.email);

    // Return what a backend would: a token and some profile info
    return Promise.resolve({ token, nickname: user.nickname });
  },

  /*
    getCurrentUser()
    - returns the user object for the current token (from localStorage)
    - used in the Dashboard to show nickname etc.
  */
  getCurrentUser() {
    const email = localStorage.getItem(CURRENT_EMAIL);
    if (!email) return null;
    const users = loadUsers();
    return users.find((u) => u.email === email) || null;
  },

  /*
    logout()
    - removes the token and the current email
  */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CURRENT_EMAIL);
  },

  /*
    isAuthenticated()
    - quick check: presence of token -> authenticated
    - note: in real apps, you should also validate token expiry and optionally decode it.
  */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default mockAuth;

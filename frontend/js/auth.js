export const Auth = {
  setSession(user, token) {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  },
  clear() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  },
  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
};
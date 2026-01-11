// Simpan status login di localStorage (untuk demo)
export const loginPengunjung = () => {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', 'pengunjung');
};

export const logout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};
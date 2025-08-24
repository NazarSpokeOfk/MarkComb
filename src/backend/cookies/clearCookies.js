const clearCookie = (res) => {
  res.clearCookie('sessionToken', { path: '/', sameSite: 'strict' });
  res.clearCookie('csrfToken', { path: '/', sameSite: 'strict' });
  res.clearCookie('connect.sid', { path: '/', sameSite: 'strict' });
};

export default clearCookie
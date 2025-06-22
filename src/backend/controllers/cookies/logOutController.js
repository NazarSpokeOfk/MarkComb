const clearCookie = (res) => {
  res.clearCookie('sessionToken', { path: '/', sameSite: 'lax' });
  res.clearCookie('csrfToken', { path: '/', sameSite: 'lax' });
  res.clearCookie('connect.sid', { path: '/', sameSite: 'lax' });
};

export default clearCookie
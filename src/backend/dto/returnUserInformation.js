const returnUserInformation = (user, token = null, csrfToken = null) => {
  return {
    csrfToken,
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      uses: user.uses,
      lang: user.lang,
      isVoteEnabled: user.isvoteenabled,
      subscription_expiration: user.subscription_expiration || "",
      isSubscriber: user.isSubscriber,
  };
};
export default returnUserInformation;

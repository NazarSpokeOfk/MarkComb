const returnUserInformation = (user, csrfToken = null) => {
  return {
    csrfToken,
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      uses: user.uses,
      isVoteEnabled: user.isvoteenabled,
      subscription_expiration: user.subscription_expiration || "",
      isSubscriber: user.isSubscriber,
  };
};
export default returnUserInformation;

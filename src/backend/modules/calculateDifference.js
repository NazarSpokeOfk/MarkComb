const calculateDifference = (firstDay, lastDay) => {
  return {
    differencesInNumbers: {
      views: lastDay.views - firstDay.views,
      likes: lastDay.likes - firstDay.likes,
      comments: lastDay.comments - firstDay.comments,
    },
    differencesInPercents: {
      views: parseFloat(
        ((lastDay.views - firstDay.views) / firstDay.views) * 100
      ).toFixed(4),
      likes: parseFloat(
        ((lastDay.likes - firstDay.likes) / firstDay.likes) * 100
      ).toFixed(1),
      comments: parseFloat(
        ((lastDay.comments - firstDay.comments) / firstDay.comments) * 100
      ).toFixed(1),
    },
  };
};
export default calculateDifference;

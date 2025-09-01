const returnWorkingThumbnailURL = (URL) => {
    const workingURL = URL.replace("yt3.ggpht.com", "yt3.googleusercontent.com");
    return workingURL;
}
export default returnWorkingThumbnailURL;

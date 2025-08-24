import logger from "../../winston/winston.js"
class PromotionController {

    apiKey = process.env.GOOGLE_API_KEY;

    channelAndVideoSearch = async (req, res) => {
        console.log("Бэк : Рекбади : ", req.body)
        const {channelName,inputValue} = req.body 
        if(!channelName || !inputValue){
          res.status(404).json({status : false})
        } else {
          const urlForChannelId = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelName}&key=${this.apiKey}`;
          try {
            const resForChannelId = await fetch(urlForChannelId);
            if (!resForChannelId.ok) {
              return Promise.reject();
            }
            const finalChannelIdResult = await resForChannelId.json();
            const channelId = finalChannelIdResult?.items?.[0]?.id?.channelId; // Ошибка мб
            const urlForVideoSearch = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&q=${encodeURIComponent(
              inputValue
            )}&order=date&key=${this.apiKey}`;
            const resForVideosSearch = await fetch(urlForVideoSearch);
            
            if (!resForVideosSearch.ok) {
              return Promise.reject();
            }
            const videoData = await resForVideosSearch.json();
      
            let triplet
            
            if(videoData?.items?.[0]?.snippet?.title.length > 30){
               triplet = "..."
            } else {
              triplet = ""
            }
            const finalVideoData = {
              title: videoData?.items?.[0]?.snippet?.title.slice(0,35) + triplet,
              thumbnail: videoData?.items?.[0]?.snippet?.thumbnails?.medium?.url,
              videoId : videoData?.items?.[0]?.id?.videoId
            };
  
            res.json({finalVideoData})
  
          } catch (error) {
            logger.error("Ошибка:", error);
          }
        }
    };

    requests = 0

    getAnalitics = async (req,res) => {

      this.requests += 1;

      console.log("Запросов на API : " , this.requests)

      const {videoId} = req.body;
        const urlForAnalitics = `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${this.apiKey}`;
        try{
          const rawData = await fetch(urlForAnalitics);
    
          const data = await rawData.json();

          const analitics = {
            views : data?.items?.[0]?.statistics?.viewCount,
            likes : data?.items?.[0]?.statistics?.likeCount
          }
          
          res.json({analitics})
        } catch (error) {
          res.status(400).json({message : "ошибка в getAnalitics"})
        }
    };
}
export default PromotionController
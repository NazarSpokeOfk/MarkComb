import GetData from "./getData.js";

const getDataController = async (req,res) => {
    const {channelId} = req.body;

    try {
        const getDataRequest = await GetData(channelId);
 
        return res.status(200).json({
            getDataRequest
        })
    } catch (error) {
        console.log("Возникла ошибка в getDataController : " , error)
        return res.status(500).json({message : "Ошибка в получении email" , error})
    }
}

export default getDataController;
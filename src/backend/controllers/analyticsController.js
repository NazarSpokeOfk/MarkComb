import sendResponseModule from "../modules/sendResponseModule.js"
import { getAnalyticsByDay, getAnalyticsByRande } from "../services/analytics.service.js"

export async function GetAnalyticsByRande (req,res) {
    const {videoId,startDate,endDate} = req.body;
    try {
        const result = await getAnalyticsByRande(videoId,startDate,endDate)
        sendResponseModule(res,result)
    } catch (error) {
        console.log("Ошибка в GetAnalyticsByRande : ",error)
        sendResponseModule(res,null,error)
    }
}
export async function GetAnalyticsByDay (req,res) {
    const {videoId,date} = req.body;
    try {
        const result = await getAnalyticsByDay(videoId,date)
        sendResponseModule(res,result)
    } catch (error) {
        console.log("Возникла ошибка в GetAnalyticsByDay : ", error)
        sendResponseModule(res,null,error)
    }
}
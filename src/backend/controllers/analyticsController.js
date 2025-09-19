import sendResponseModule from "../modules/sendResponseModule.js"
import { getAnalyticsTotal, getAnalyticsYesterday, getAnalyticsBetween } from "../services/analytics.service.js"

export async function GetAnalyticsTotal(req,res) {
    const {videoId} = req.body;
    try {
        const result = await getAnalyticsTotal(videoId)
        sendResponseModule(res,result);
    } catch (error) {
        console.log("Ошибка в GetAnalyticsTotal : ",error)
        sendResponseModule(res,null,err)
    }
}
export async function GetAnalyticsYesterday(req,res) {
    const {videoId} = req.body;
    try {
        const result = await getAnalyticsYesterday(videoId)
        sendResponseModule(res,result);
    } catch (error) {
        console.log("Ошибка в GetAnalyticsYesterday : ",error)
        sendResponseModule(res,null,error)
    }
}
export async function GetAnalyticsBetween(req,res) {
    const {startDate,endDate,videoId} = req.body;
    try {  
        const result = await getAnalyticsBetween(startDate,endDate,videoId);
        sendResponseModule(res,result);
    } catch (error) {
        console.log("Ошибка в GetAnalyticsBetween : ",error)
        sendResponseModule(res,null,error)
    }
}
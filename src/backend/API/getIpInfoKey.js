const getIpInfoKey = async (req,res) => {
    const apiKey = process.env.IP_INFO_API_KEY;
    res.json(apiKey)
}
export default getIpInfoKey
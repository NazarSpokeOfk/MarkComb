import getEmailModule from "../../modules/getEmailModule.js";
const getEmailController = async (req, res) => {
  const { channelId } = req.body;

  try {
    const getDataRequest = await getEmailModule(channelId);

    return res.status(200).json({
      getDataRequest,
    });
  } catch (error) {
    console.log("Возникла ошибка в getDataController : ", error);
    return res.status(500).json({ message: "Ошибка в получении email", error });
  }
};

export default getEmailController;

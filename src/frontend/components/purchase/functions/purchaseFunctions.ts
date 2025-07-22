import DataToDB from "../../../Client-ServerMethods/dataToDB";
import { ValidatePaymentProps } from "../../../types/types";

const dataToDb = new DataToDB()
class PurchaseFunctions {
    async validatePayment ({user_id,packageId,userEmail,setError,setIsLoading} : ValidatePaymentProps) {
        if(!user_id || !packageId || !userEmail){
            setError("We lost your data,sorry. Try again later.")
            return;
        }
        setIsLoading(true)
        const link = await dataToDb.payment({user_id,packageId,userEmail})
        window.location.href = await link.confirmationURL;
        setIsLoading(false)
    }
}
export default PurchaseFunctions
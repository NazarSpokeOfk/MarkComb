import {
  HandleNameChangeProps,
  CheckWhatChangeProps,
  DeleteUserProps,
} from "../../../types/types";
import DataToDB from "../../../Client-ServerMethods/dataToDB";

const dataToDB = new DataToDB();

class ProfileFunctions {
  handleNameChange = ({
    e,
    setLocalName,
    setChangedData,
  }: HandleNameChangeProps) => {
    const value = e.target.value;
    setLocalName(value);
    setChangedData((prevData) => ({
      ...prevData,
      username: value,
    }));
  };

  async deleteUser({token,setIsDeleting} : DeleteUserProps){
    try {
      dataToDB.logOut();
      const response = await dataToDB.deleteUser(token)
      console.log(response)
      if(response.data.isAccountDeleted){
        setIsDeleting(false);
      }
    } catch (error) {
      console.log("deleteUser : " , error)
    }
  }
}
export default ProfileFunctions;

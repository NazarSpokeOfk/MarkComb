import {HandleNameChangeProps, CheckWhatChangeProps} from "../../../types/types"

class ProfileFunctions {
  handleNameChange = ({ e, setLocalName, setChangedData } : HandleNameChangeProps) => {
    const value = e.target.value;
    setLocalName(value);
    setChangedData((prevData) => ({
      ...prevData,
      username: value,
    }));
  };

  checkWhatChange = ({ changedData, setChangedData } : CheckWhatChangeProps) => {
    if (changedData.username != "" && changedData.newPassword === "") {
      console.log("username");
      setChangedData((prevData) => ({ ...prevData, changeMethod: "username" }));
    } else if (changedData.username != "" && changedData.newPassword != "") {
      setChangedData((prevData) => ({
        ...prevData,
        changeMethod: "username&password",
      }));
    } else if (changedData.newPassword != "" && changedData.username === "") {
      setChangedData((prevData) => ({ ...prevData, changeMethod: "password" }));
    }
  };


}
export default ProfileFunctions;

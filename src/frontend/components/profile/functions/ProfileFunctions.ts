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
}
export default ProfileFunctions;

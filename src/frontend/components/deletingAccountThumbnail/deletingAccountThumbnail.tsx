import AuthorizationThumbnail from "../authorizationThumbnail/authorizationThumbnail";
import smoothThumbnail from "../../utilities/smoothThumbnail";
import loading from "../../images/loading-gif.gif";

import { statusMessages, UserData } from "../../interfaces/interfaces";

import { useState, useRef, useEffect } from "react";

import { DeletingAccountThumbnailProps } from "../../types/types";

import ProfileFunctions from "../profile/functions/ProfileFunctions";

import "./deletingAccountThumbnail.css";

const DeletingAccountThumbnail = ( {userData} : DeletingAccountThumbnailProps) => {
  const profileFunctions = new ProfileFunctions();
  const [isDeleting, setIsDeleting] = useState<boolean>(true);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDeleting) {
      smoothThumbnail(thumbnailRef);
    }
  }, [isDeleting]);

  useEffect(() => {
    console.log(userData)
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if(!token) return;
    profileFunctions.deleteUser({token,setIsDeleting}); 
  },[])
  return (
    <>
      {isDeleting ? (
        <>
          <img className="delete__loading" src={loading} alt="" />
        </>
      ) : (
        <AuthorizationThumbnail
          thumbnailRef={thumbnailRef}
          statusMessages={statusMessages}
          status="successfullDeleting"
        />
      )}
    </>
  );
};

export default DeletingAccountThumbnail;

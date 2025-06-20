/// <reference types="vite/client" />

import {toast} from "react-toastify"

import openModal from "../../../utilities/openModal"
import closeModal from "../../../utilities/closeModal"

const apiBaseUrl = import.meta.env.VITE_API_URL;

import { MakeFetchForCodeProps , FetchDataProps } from "../../../types/types";

class VerifModalFunctions {

    async makeFetchForCode({signInData} : MakeFetchForCodeProps) : Promise<boolean>{
        try {
          const email = signInData.email;
          console.log(signInData);
      
          const result = await fetch(`${apiBaseUrl}/verification`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              "x-api-key": import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify({ email, operationCode : 3 }),
          });
      
          if (result.ok) {
            return false; 
          } else {
            return true;  
          }
        } catch (error) {
          toast.error(
            "We occured a server error sending verification code. Please, try again later"
          );
          return true;
        }
      };

    async fetchData ({isDataFilledIn,modalRef,signInData} : FetchDataProps) {
        console.log("isDataFilledIn", isDataFilledIn);
    
        const accountExists = await this.makeFetchForCode({signInData});
    
        if (isDataFilledIn && !accountExists) {
          setTimeout(() => {
            openModal({ref : modalRef})
          }, 100);
        } else {
          toast.error("Account exists")
          closeModal({ref : modalRef})
          setTimeout(() => {
            if (modalRef.current) {
              modalRef.current.style.visibility = "hidden";
            }
          }, 600);
        }
      };
}
export default VerifModalFunctions
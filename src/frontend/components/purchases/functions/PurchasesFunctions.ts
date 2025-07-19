import { toast } from "react-toastify";
import i18n from "i18next";

import DataToDB from "../../../Client-ServerMethods/dataToDB";

import {
  HandleDeleteProps,
  RemovePurchaseProps,
  ScrollContainerProps,
} from "../../../types/types";

const dataToDb = new DataToDB();

class PurchasesFunctions {
  async removePurchase({
    user_id,
    channelName,
    csrfToken,
    setUserData,
    contentRefs,
    transaction_id,
  }: RemovePurchaseProps) {
    const el = contentRefs.current[transaction_id];
    if (el) {
      el.classList.add("fall-off");
      setTimeout(() => {
        try {
          dataToDb.deletePurchaseData({
            channelName,
            userId: user_id,
            csrfToken,
          });

          setUserData((prevData) => ({
            ...prevData,
            channels: prevData.channels.filter(
              (p) => p.transaction_id !== transaction_id
            ),
          }));

          delete contentRefs.current[transaction_id]; // Чистим ref
        } catch (error) {
          console.error("Error removing channel:", error);
        }
      }, 500);
    }
  }

  scrollContainer({ containerRef, contentRefs }: ScrollContainerProps) {
    const appearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            entry.target.classList.remove("fall-off");
            entry.target.classList.remove("initial-hidden");
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.3,
      }
    );

    const disappearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            entry.target.classList.remove("animate-in");
            entry.target.classList.add("fall-off");
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.1,
      }
    );

    contentRefs.current.forEach((el) => {
      if (el) {
        appearObserver.observe(el);
        disappearObserver.observe(el);
      }
    });
  }
}

export default PurchasesFunctions;

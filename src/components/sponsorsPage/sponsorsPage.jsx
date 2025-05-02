import Header from "../header/Header"
import Footer from "../footer/Footer"

import SponsorsImg from "../../icons/sponsorsimg.jpg"
import { useTranslation } from "react-i18next";

import "./sponsorsPage.css"

const SponsorsPage = () => {
    const { t } = useTranslation();
    return (
        <>  
            <Header/>
            <div className="container">

                <h1 className="top__sponsors-title">
                    {t("top-")}<span>{t("sponsors")}</span>
                </h1>

                <img src={SponsorsImg} alt="Thanks to all sponsors img" className="sponsors__img"/>

                <div className="sponsor__blocks">
                    <div className="sponsor__block">
                        <h3 className="sponsor__block-name">
                            Sponsor name
                        </h3>
                        <p className="sponsor__block-comment">
                            Sponsor Comment
                        </p>
                    </div>

                    <div className="sponsor__block">
                        <h3 className="sponsor__block-name">
                            Sponsor name
                        </h3>
                        <p className="sponsor__block-comment">
                            Sponsor Comment
                        </p>
                    </div>
                </div>

                <h2 className="sponsors__title">
                    {t("sponsors")}
                </h2>
                <div className="dsponsors__block">
                    <h3 className="dsponsors__name">
                        sponsorname
                    </h3>
                </div>
            </div>
            <Footer/>
        </>
    )
}
export default SponsorsPage
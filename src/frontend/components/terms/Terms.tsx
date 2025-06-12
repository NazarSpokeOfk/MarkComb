import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { Helmet, HelmetProvider } from "react-helmet-async";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./Terms.css";
const Terms = () => {
  const { t, i18n } = useTranslation();
  document.body.style.overflow = "";
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>{t("Study the terms of use of MarkComb")}</title>
          <meta name="description" content="Terms of use of MarkComb" />
        </Helmet>
        <section className="terms">
          <h1 className="terms__title">{t("Terms of service")}</h1>
          <div className="terms__container">
            <h2 className="terms-company__name">MarkComb</h2>

            <h3 className="terms__subtitle none">
              {t("Using the YouTube API")}
            </h3>
            <p className="terms__defenition none">
            <Trans i18nKey="Google">
              The MarkComb service uses the YouTube API to provide some of the
              functionality related to searching and displaying information
              about YouTube channels. Use of this API is governed by the{" "}
              <a href="https://developers.google.com/youtube/terms/api-services-terms-of-service">
                YouTube API Terms of Service
              </a>
              , which the User agrees to read and agree to. MarkComb's use of
              the YouTube API is also subject to{" "}
              <a href="https://policies.google.com/privacy">
                Google's Privacy Policy
              </a>
              governing the processing of information collected through the API.
              By using MarkComb, you agree to be bound by the above documents.
            </Trans>
            </p>
  
            <h3 className="terms__subtitle none">
              1.{t("General Provisions")}
            </h3>
            <p className="terms__defenition none">
              <span>1.1 {t("Contentmaker")}</span> -{" "}
              <Trans i18nKey="Contentmaker-defi">
                a person who independently creates and publishes various types
                of content (texts, images, videos, audio files and other
                materials) for the purpose of information dissemination,
                audience interaction or commercial use on various platforms and
                media environments.
              </Trans>
            </p>

            <p className="terms__defenition none">
              <span>1.2.{t("Uses")}</span> -{" "}
              <Trans i18nKey="Uses-defi">
                are the internal currency of the site used to obtain contact
                information. They are purchased with real money and there are no
                refunds for unused Uses.
              </Trans>
            </p>

            <p className="terms__defenition none">
              <span>1.3 {t("Authentication Data of the User")}</span> -{" "}
              <Trans i18nKey="Auth">
                login (cell phone number / e-mail address of the User) and
                password (access code, which the User comes up with on his/her
                own), which together are recognized as a simple electronic
                signature of the User. The User shall independently ensure the
                safety of their Authentication Data
              </Trans>
            </p>

            <p className="terms__defenition none">
              <span>1.4 {t("User")}</span> -{" "}
              <Trans i18nKey="User-defi">
                a person accessing the Site and using materials and services on
                the Site. services posted on the Site.
              </Trans>
            </p>

            <p className="terms__defenition none">
              <span>1.5 {t("Contact data")}</span> -{" "}
              <Trans i18nKey="Contact-defi">
                is publicly available information collected and made available
                to users through the technologies of our service. This data
                includes e-mail addresses, links to social networks and other
                information intended for communication with content creators.
                Our service uses technology to find and process such information
                from public sources, while not violating the privacy and rights
                of third parties. Contact information is provided for the
                purpose of interacting with content creators, but the service
                does not guarantee its relevance, completeness or relevance to
                specific user requests
              </Trans>
            </p>

            <h3 className="terms__subtitle none">
              2.{t("Registration and account")}
            </h3>

            <p className="terms__defenition none">
              2.1{" "}
              <Trans i18nKey="2.1">
                The user is obliged to provide accurate information when
                registering.
              </Trans>
            </p>

            <p className="terms__defenition none">
              2.2{" "}
              <Trans i18nKey="2.2">
                Administration of MarkComb has rights to block account, if the
                user will violate section 4 or section 5
              </Trans>
            </p>

            <p className="terms__defenition none">
              2.3{" "}
              <Trans i18nKey="2.3">
                The user is responsible for the storage of his/her credentials
              </Trans>
            </p>

            <h3 className="terms__subtitle none">
              3.{t("Terms of use of the service")}
            </h3>

            <p className="terms__defenition none">
              3.1{" "}
              <Trans i18nKey="3.1">
                User can use the service only within the confines of the law
              </Trans>
            </p>

            <p className="terms__defenition none">
              3.2{" "}
              <Trans i18nKey="3.2">
                Administration can restrict access for service at any time,
                without explaining reasons
              </Trans>
            </p>

            <h3 className="terms__subtitle none">4. {t("Banned : ")}</h3>

            <p className="terms__defenition none">
              4.1{" "}
              <Trans i18nKey="4.1">
                Selling accounts, with contentmakers' contact information
                already purchased; <br />
                exchange of accounts between users;
              </Trans>
            </p>

            <p className="terms__defenition none">
              4.2{" "}
              <Trans i18nKey="4.2">Using the service for spam mailings;</Trans>
            </p>

            <p className="terms__defenition none">
              4.3{" "}
              <Trans i18nKey="4.3">Hacking attempts and other attacks</Trans>
            </p>

            <p className="terms__defenition none">
              4.4{" "}
              <Trans i18nKey="4.4">
                Resale of previously purchased contact data to other service
                users
              </Trans>
            </p>

            <p className="terms__defenition none">
              4.5{" "}
              <Trans i18nKey="4.5">
                Phishing, service forgery for scam purposes
              </Trans>
            </p>

            <p className="terms__defenition none">
              4.6{" "}
              <Trans i18nKey="4.6">
                Attempts to hack into existing accounts; <br />
                trying to find a password to an existing account, which does not
                belong to you
              </Trans>
            </p>

            <h3 className="terms__subtitle none">5. {t("Payments")}</h3>

            <p className="terms__defenition none">
              5.1{" "}
              <Trans i18nKey="5.1">
                Purchase of “Uses” is made through payment systems connected to
                the service.
              </Trans>
            </p>

            <p className="terms__defenition none">
              5.2{" "}
              <Trans i18nKey="5.2">
                There are no refunds, except in cases of technical errors on the
                part of the service
              </Trans>
            </p>

            <h3 className="terms__subtitle none">
              6. {t("Limitations of liability")}
            </h3>

            <p className="terms__defenition none">
              6.1{" "}
              <Trans i18nKey="6.1">
                The service provides data “as is” and is not responsible for its
                accuracy.
              </Trans>
            </p>

            <p className="terms__defenition none">
              6.2{" "}
              <Trans i18nKey="6.2">
                Administration is not responsible for losses caused by the use
                of the service or impossibility to use the service
              </Trans>
            </p>

            <p className="terms__defenition none">
              6.3{" "}
              <Trans i18nKey="Contact-defi">
                The Service is not responsible for any damages resulting from
                unauthorized access to user accounts.
              </Trans>
            </p>

            <h3 className="terms__subtitle none">7. {t("Personal Data")}</h3>

            <p className="terms__defenition none">
              7.1{" "}
              <Trans i18nKey="7.1">
                Service using personal data in accordance with policy of{" "}
                <Link to={"/dataprocessing"}>personal data processing</Link>
              </Trans>
            </p>

            <h3 className="terms__subtitle none">8. {t("Changes in terms")}</h3>
            <p className="terms__defenition none">
              8.1{" "}
              <Trans i18nKey="8.1">
                The Service reserves the right to change the terms and
                conditions without prior notice
              </Trans>
            </p>

            <p className="terms__defenition none">
              8.2{" "}
              <Trans i18nKey="8.2">
                Continued use of the service after the changes means agreement
                to the new terms and conditions.
              </Trans>
            </p>

            <p className="terms__defenition none">
              8.3{" "}
              <Trans i18nKey="8.3">
                Significant changes may be accompanied by user notification.
              </Trans>
            </p>

            <h3 className="terms__subtitle none">
              9. {t("Dispute Resolution")}
            </h3>

            <p className="terms__defenition none">
              9.1{" "}
              <Trans i18nKey="9.1">
                All disputes shall be settled in a pre-trial procedure through
                negotiations.
              </Trans>
            </p>

            <p className="terms__defenition none">
              9.2{" "}
              <Trans i18nKey="9.2">
                If no agreement can be reached, the dispute is considered in
                court at the place of registration of the service owner.
              </Trans>
            </p>
          </div>
        </section>
      </HelmetProvider>
    </>
  );
};
export default Terms;

import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { Helmet , HelmetProvider } from "react-helmet-async";

import SmoothEffect from "../smoothText";

import "../terms/Terms.css";

const UserDataProcessing = () => {
  const { t, i18n } = useTranslation();
  document.body.style.overflow = "";

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>User data processing agreement</title>
          <meta name="description" content="Study the agreement with the processing of personal data" />
        </Helmet>
        <header>
          <div className="container">
            <div className="logo">
              {isLittleMobile ? (
                <>
                  <Link to="/">
                    M<span>K</span>
                  </Link>
                </>
              ) : (
                <>
                  {" "}
                  <Link to="/">
                    Mark<span>Comb</span>
                  </Link>
                </>
              )}
            </div>
            <div className="header__links">
              <Link to="/purchases" className="header__link">
                {t("purc")}
                <span className="highlight">{t("hases")}</span>
              </Link>

              <Link to="/promotion" className="header__link">
                {t("prom")}
                <span>{t("otion")}</span>
              </Link>

              <Link to="/purchase" className="header__link">
                {t("purch")}
                <span>{t("ase")}</span>
              </Link>
            </div>
          </div>
        </header>
      <section className="terms">
        <h1 className="terms__title">
          {t("Personal Data Processing Agreement")}
        </h1>
        <div className="terms__container">
          <h3 className="terms__subtitle none">1.{t("General Provisions")}</h3>
          <p className="terms__defenition none">
            <span>1.1</span> -{" "}
            <Trans i18nKey="1.01">
              This Privacy Policy (hereinafter referred to as the "Policy")
              describes how MarkComb (hereinafter referred to as the "Service")
              collects, processes, stores, and protects personal data of users.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.2.</span> -{" "}
            <Trans i18nKey="1.02">
              The Service ensures the confidentiality and security of
              personal data in accordance with applicable data protection laws,
              including, but not limited to, GDPR , 152-ФЗ (General Data
              Protection Regulation, Федеральный закон "О персональных данных" )
              and relevant national regulations.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.3</span> -{" "}
            <Trans i18nKey="1.03">
              By using the Service, the User agrees to the terms of this Policy
              and gives explicit consent to the processing of their personal
              data.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.4</span> -{" "}
            <Trans i18nKey="1.04">
            This Policy is developed in accordance with the Federal Law No. 152-FZ of July 27, 2006 “On Personal Data” and other regulatory acts of the Russian Federation in the field of personal data protection.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.5</span> -{" "}
            <Trans i18nKey="1.05">
            The User expresses his/her consent to this Personal Data Processing Policy when registering with the Service and starting to use it.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.6</span> -{" "}
            <Trans i18nKey="1.06">
            If the User does not agree with the terms of personal data processing, he/she must stop using the Service.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <span>1.7</span> -{" "}
            <Trans i18nKey="1.07">
            The processing of personal data is carried out on the basis of the following legal grounds:
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="consent">
             - consent of the personal data subject (Article 6, paragraph 1, item 1 of the Federal Law-152);
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="fulfillment">
             - fulfillment of the contract with the user (Art. 6, part 1, p. 5 of the Federal Law-152);
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="fulfillment of obligations">
             - fulfillment of obligations stipulated by Russian legislation (e.g., tax accounting).
            </Trans>
          </p>

          <h3 className="terms__subtitle none">2.{t("2. Data Collected")}</h3>

          <h3 className="terms__subtitle none">
            {t(
              "The Service may collect the following categories of personal data:"
            )}
          </h3>

          <p className="terms__defenition none">
            <Trans i18nKey="Account info">
              - Account Information: Name, email address
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Authentication Data">
              - Authentication Data: Login credentials (email and password,
              stored in encrypted form).
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Payment Data">
              - Payment Data: Transaction details (processed via third-party
              payment providers, without storing full payment card details).
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Usage Data">
              - Usage Data: IP address, browser type, operating system, and user
              activity on the platform.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="The service does">
            - The service does not collect biometric data, health information, political views, race, nationality and religion.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            3.{t("Purpose of Data Processing")}
          </h3>

          <h3 className="terms__subtitle none">
            {t(
              "The Service collects and processes personal data for the following purposes:"
            )}
          </h3>

          <p className="terms__defenition none">
            <Trans i18nKey="Providing Service">
            - Providing Service operation, authorization and account access;
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To provide access">
              - To provide access to the platform and its features.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To process payments">
              - To process payments and transactions securely.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To improve user">
              - To improve user experience and optimize the service.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To comply with">
              - To comply with legal obligations (e.g., tax and financial
              regulations).
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To prevent fraudulent ">
              - To prevent fraudulent activities and ensure security.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="To provide customer">
              - To provide customer support and resolve disputes.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            4. {t("Data Sharing and Third Parties")}
          </h3>

          <p className="terms__defenition none">
            4.1{" "}
            <Trans i18nKey="The Service does not sell">
              The Service does not sell or rent users' personal data to third
              parties.
            </Trans>
          </p>

          <p className="terms__defenition none">
            4.2{" "}
            <Trans i18nKey="Data may be">
              Data may be shared with trusted third-party service providers,
              including:
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Payment processors">
              - Payment processors to handle transactions.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Legal and regulatory">
              - Legal and regulatory authorities when required by law.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Analytical services">
              - Analytical services (e.g., Google Analytics) for platform
              optimization.
            </Trans>
          </p>

          <p className="terms__defenition none">
            4.3{" "}
            <Trans i18nKey="The Service ensures">
              The Service ensures that third parties comply with data protection
              regulations and handle personal data securely.
            </Trans>
          </p>

          <p className="terms__defenition none">
            4.4{" "}
            <Trans i18nKey="The Operator may">
            The Operator may transfer personal data abroad only to countries that ensure adequate protection of personal data (Article 12 of the Federal Law-152). In case of data transfer to countries that are not included in this list, the Operator requests additional consent from the User.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            5. {t("Data Storage and Security")}
          </h3>

          <p className="terms__defenition none">
            5.1{" "}
            <Trans i18nKey="The Service stores">
              The Service stores user data on secure servers with encryption and
              access control mechanisms.
            </Trans>
          </p>

          <p className="terms__defenition none">
            5.2{" "}
            <Trans i18nKey="User passwords">
              User passwords are stored in hashed form and cannot be retrieved
              in plaintext.
            </Trans>
          </p>

          <p className="terms__defenition none">
            5.3{" "}
            <Trans i18nKey="Personal data is retained">
              Personal data is retained only for as long as necessary to fulfill
              the purposes outlined in this Policy, after which it is securely
              deleted.
            </Trans>
          </p>

          <p className="terms__defenition none">
            5.4{" "}
            <Trans i18nKey="Personal data shall">
            Personal data shall be stored for the period necessary to fulfill the specified processing purposes, but no longer than 3 (three) years after deletion of the account, unless otherwise provided for by the legislation of the Russian Federation.
            </Trans>
          </p>

          <p className="terms__defenition none">
            5.5{" "}
            <Trans i18nKey="After the expiration">
            After the expiration of the said period, personal data shall be destroyed or depersonalized.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">6. {t("User Rights")}</h3>

          <h3 className="terms__subtitle none">
            {t(
              "Users have the following rights regarding their personal data:"
            )}
          </h3>

          <p className="terms__defenition none">
            <Trans i18nKey="Right to Access">
              - Right to Access – Request a copy of the personal data stored.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Right to Rectification">
              - Right to Rectification – Request corrections to inaccurate or
              incomplete data.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Right to Deletion">
              - Right to Deletion – Request deletion of personal data (subject
              to legal obligations).
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Right to Restrict">
              - Right to Restrict Processing – Limit the use of personal data in
              certain circumstances.
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Right to Object">
              - Right to Object – Withdraw consent for data processing where
              applicable.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            {t("To exercise these rights, users may contact the Service at ")}
            <a href="mailto:markcombsup@gmail.com.">markcombsup@gmail.com</a>
          </h3>

          <h3 className="terms__subtitle none">
            7.{t("Cookies and Tracking Technologies")}
          </h3>

          <p className="terms__defenition none">
            7.1{" "}
            <Trans i18nKey="The Service uses cookies">
              The Service uses cookies to improve user experience and track
              analytics.
            </Trans>
          </p>

          <p className="terms__defenition none">
            7.2{" "}
            <Trans i18nKey="Users can manage cookie">
              Users can manage cookie preferences via their browser settings.
            </Trans>
          </p>


          <p className="terms__defenition none">
            7.3{" "}
            <Trans i18nKey="The User can disable">
            The User can disable cookies in the browser settings. Disabling cookies may affect the performance of some functions of the Service.
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            8. {t("Changes to the Policy")}
          </h3>

          <p className="terms__defenition none">
            8.1{" "}
            <Trans i18nKey="The Service reserves">
              The Service reserves the right to update this Policy. Any
              significant changes will be communicated via email or platform
              notifications.
            </Trans>
          </p>

          <p className="terms__defenition none">
            8.2{" "}
            <Trans i18nKey="Continued use of the Service">
              Continued use of the Service after updates constitutes acceptance
              of the revised Policy.
            </Trans>
          </p>

          <p className="terms__defenition none">
            8.3{" "}
            <Trans i18nKey="The Operator notifies">
            The Operator notifies users about the changes made to the Personal Data Processing Policy by publishing the updated version on the website.
            </Trans>
          </p>

          <p className="terms__defenition none">
            8.4{" "}
            <Trans i18nKey="In case of material">
            In case of material changes requiring a new consent, the Operator will notify the users in an additional way (e.g. via email).
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            9. {t("Contact Information")}
          </h3>

          <p className="terms__defenition none">
            <Trans i18nKey="If you have any">
              If you have any questions regarding this Policy, you can contact
              us at: <br /> 📧 Email:{" "}
              <a type="email" href="mailto:markcombsup@gmail.com">
                markcombsup@gmail.com
              </a>
            </Trans>
          </p>

          <h3 className="terms__subtitle none">
            10. {t("Operator of personal data:")}
          </h3>

          <p className="terms__defenition none">
            <Trans i18nKey="The personal data">
            10.1 The personal data controller is [Kuryatnikov Nazar
              Alekseevich], registered as a tax payer on professional income (self-employed) residing at the following address: [Kuryatnikov Nazar].
              professional income (self-employed) 
            </Trans>
          </p>

          <p className="terms__defenition none">
            <Trans i18nKey="Contact details">
            10.2 Contact details of the operator for communication regarding processing of personal data: 📧 Email: <a href="mailto:markcombsup@gmail">markcombsup@gmail</a> 📞 Phone: <a href="tel:79299913911">+7-929-991-39-11</a>
            </Trans>
          </p>
        </div>
      </section>

      <section className="footer">
      <div className="footer__container">
          <div className="footer-first__group">
            <div id="logo_footer" className="logo">
              Mark<span>Comb</span>
            </div>
          </div>

          <div className="footer-second__group">
            <Link id="Terms" to="/terms" className="footer__terms none">
              {t("Terms of service")}
            </Link>
            <Link to="/purpose" className="footer__purpose none">
              {t("Our purpose")}
            </Link>
            <Link to="/dataprocessing" className="footer__purpose none">
              {t("Personal Data Processing Agreement")}
            </Link>
            <h4 className="footer-third__group-text">2025 MarkComb</h4>
            <h4 className="footer-third__group-text">
              📧{" "}
              <a href="mailto:markcombsup@gmail.com">markcombsup@gmail.com</a>
            </h4>
          </div>
          <div className="footer__btns-container">
            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  i18n.changeLanguage("ru");
                });
              }}
              className="footer__button"
              id="RuButton"
            >
              Ru
            </button>
            <button
              onClick={() => {
                SmoothEffect().then(() => {
                  console.log(i18n);
                  i18n.changeLanguage("en");
                });
              }}
              className="footer__button"
            >
              En
            </button>
          </div>
        </div>
      </section>
      </HelmetProvider>
    </>
  );
};
export default UserDataProcessing;

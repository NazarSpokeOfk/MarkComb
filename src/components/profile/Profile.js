import './profile.css'
import Edit from '../../images/image 70.png'
import profileImg from '../../images/Ellipse 1.jpg'

import SmoothEffect from '../smoothText'


import { Link } from 'react-router-dom'
import { useTranslation } from "react-i18next";
const Profile = () => {
    const { t, i18n } = useTranslation();
    document.body.style.overflow = "";
    return(
        <>
    <header>
        <div class="container">
          <Link to="/" class="logo">M<span>K</span></Link>
          <div class="header__links">
            <Link to="/purchases"  class="header__link">{t('purc')}<span>{t('hases')}</span></Link>
            <Link to="/promotion"  class="header__link">{t('prom')}<span>{t('otion')}</span></Link>
            <Link to="/purchase" class="header__link">{t('purc')}<span>{t('hase')}</span></Link>
          </div>
        </div>  
    </header>

    <section class="profile">
        <div class="container">
            <img src={profileImg} alt="" class="profile_photo-circle"/>
            <h1 class="profile_name">
                Nazar
            </h1>
            <button class="profile__edit-button">
                <img src={Edit} alt="edit"/>
            </button>

            <h2 class="profile_balance-title none">
                {t('bal')}<span>{t('ance')}</span>
            </h2>
            <h3 class="profile_balance-amount">
                100$
            </h3>

            <h2 class="profile_uses-title none">
                {t('uses')}
            </h2>
            <h3 class="profile_uses-amount">
                100
            </h3>

            <div class="info_block">
                <h3 class="info_block-title none">{t('in')}<span>{t('fo')}</span></h3>
                <h2 class="info_block-email none">
                    {t('EM')}<span>{t('AIL')}</span> : kurakn10@gmail.com
                </h2>
                <button class="email__edit-button">
                    <img src={Edit} alt="edit" />
                </button>
                <h2 class="info_block-password none">
                    {t('PASS')}<span>{t('WORD')}</span> : ******
                </h2>
                <button class="password__edit-button">
                    <img src={Edit} alt="edit" />
                </button>
            </div>
        </div>
    </section>

    <section class="footer">
        <div class="footer__container">
          <h3 class="footer__logo">MK,2024</h3>
          <Link to="/terms" class="footer__terms">{t('Terms of Service')}</Link>
          <Link to="/purpose" class="footer__purpose">{t('Our Purpose')}</Link>
          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("en");
              });
            }}
            className="footer__button"
          >
            English
          </button>

          <button
            onClick={() => {
              SmoothEffect().then(() => {
                i18n.changeLanguage("ru");
              });
            }}
            className="footer__button"
          >
            Русский
          </button>
        </div>
    </section>
        </>
    )
}
export default Profile
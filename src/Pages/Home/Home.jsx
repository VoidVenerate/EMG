import React from 'react'
import HomeComp from '../../Components/HomeComp/HomeComp'
import './Home.css'
import Indie from '../../Components/Indie/Indie'
import IL from '../../Components/IL/IL'
import MusicSection from '../../Components/MusicSection/MusicSection'
import Marketing from '../../Components/Marketing/Marketing'
import Media from '../../Components/Media/Media'
import Footer from '../../Components/Footer/Footer'
import EMGTeam from '../../Components/EMGTeam/EMGTeam'
import NewsletterPopup from '../../Components/NewsletterPopup/NewsletterPopup'

const Home = () => {
  return (
    <div>
        <NewsletterPopup />
        <HomeComp />
        <Indie />
        <EMGTeam />
        <IL />
        <MusicSection />
        <Marketing />
        <Media />
        <Footer />
    </div>
  )
}

export default Home
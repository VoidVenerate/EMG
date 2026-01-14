import React, { useState, useEffect } from 'react'
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
import SocialIcons from '../../Components/SocialIcons/SocialIcons'    

const Home = () => {
  const [showPopup, setShowPopup] = useState(false)

  useEffect(() => {
    // Show popup after 4 seconds (you can adjust this: 3000 = 3s, 5000 = 5s)
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 4000)

    // Cleanup timer if component unmounts
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
        <SocialIcons />
        <HomeComp />
        {showPopup && <NewsletterPopup />}
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
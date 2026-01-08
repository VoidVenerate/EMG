import React from 'react'
import './Roster.css'
import RosterComp from '../../Components/RosterComp/RosterComp'
import Media from '../../Components/Media/Media'
import Footer from '../../Components/Footer/Footer'

const Roster = () => {
  return (
    <div>
        <RosterComp />
        <Media />
        <Footer />
    </div>
  )
}

export default Roster
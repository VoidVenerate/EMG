import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

/* ---------- PUBLIC PAGES ---------- */
import Home from './Pages/Home/Home';
import Roster from './Pages/Roster/Roster';

/* ---------- AUTH PAGES ---------- */
import Signup from './Components/SignUp/SignUp';
import SignIn from './Components/SignIn/SignIN';

/* ---------- LAYOUTS ---------- */
import UserLayout from './Pages/UserLayout/UserLayout';
import AdminLayout from './Pages/AdminLayout/AdminLayout';
import Overview from './Pages/Overview/Overview';
import Spot from './Components/Spot/Spot';
import EMGArtist from './Pages/EMGArtist/EMGArtist';
import AddArtist from './Components/AddArtist/AddArtist';
import AddSong from './Components/AddSong/AddSong';
import AddVideos from './Components/AddVideos/AddVideos';
import ArtistDetails from './Components/ArtistDetails/ArtistDetails';
import UserArtistProfile from './Pages/UserArtistProfile/UserArtistProfile';
import EditSong from './Components/EditSong/EditSong';
import EditVideo from './Components/EditVideos/EditVideos';
import Newsletter from './Components/Newsletter/Newsletter';
import ProfileDark from './Components/ProfileDark/ProfileDark';
import NewMusic from './Components/NewMusic/NewMusic';
import UserNewMusic from './Components/UserNewMusic/UserNewMusic';
import List from './Components/List/List';
import AddPlaylist from './Components/AddPlaylist/AddPlaylist';
import GetPlaylist from './Components/GetPlaylist/GetPlaylist';

const App = () => {
  const navigate = useNavigate();
  const handleArtistCreated = (artist) => {
    navigate(`/admin/artists/${artist.id}/addsongs`);
  }
  return (
    <Routes>

      {/* ===== USER ROUTES ===== */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/roster/artists/:artistId" element={<UserArtistProfile />} />
        <Route path="/new-music" element={<UserNewMusic />} />
      </Route>
        <Route path='/confirmspot' element={<Spot />} />

      {/* ===== AUTH ROUTES ===== */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<SignIn />} />

      {/* ===== ADMIN ROUTES ===== */}
      <Route element={<AdminLayout />}>
        <Route path="/adminhome" element={<Overview />} />
        <Route path="/list" element={<List />} />
        <Route path='/emgartist' element={<EMGArtist />} />
        <Route path='/addartist' element={<AddArtist onArtistCreated={handleArtistCreated} />} />
        <Route 
          path='/admin/artists/:artistId/addsongs' 
          element={
            <AddSong
              requireArtistName={true}
              showSkip={true}                     // allow skip
              skipRedirect={`/admin/artists/:artistId/addvideos`} // skip goes to add videos
              redirectTo={`/admin/artists/:artistId/addvideos`}   // after submit
            />
          } 
        />
        <Route 
          path='/admin/artist/:artistId/addsongs' 
          element={
            <AddSong
              requireArtistName={true}
              showSkip={false}                     // allow skip
              redirectTo={`/admin/artists/:artistId`}   // after submit
            />
          } 
        />
        <Route path='/admin/artists/:artistId/addvideos' element={<AddVideos/>} />
        <Route path='/admin/artist/:artistId/addvideos' element={
          <AddVideos
            showSkip={false}
          />
          } />
        <Route path='/admin/artists/:artistId' element={<ArtistDetails/>} />
        <Route path="/artists/:artistId/songs/:songId/edit" element={<EditSong/>} />
        <Route path='/admin/artists/:artistId/videos/:videoId' element={<EditVideo/>} />
        <Route path='/subscriptions' element={<Newsletter/>} />
        <Route path='/admin/new-music' element={<NewMusic/>} />
        <Route path='/me' element={<ProfileDark/>} />
        <Route path='/add-playlist' element={<AddPlaylist/>} />
        <Route path='/get-playlist' element={<GetPlaylist/>} />
      </Route>

    </Routes>
  );
};

export default App;

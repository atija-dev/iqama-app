import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { SettingDialog } from './SettingDialog';
import {useDispatch, useSelector} from 'react-redux';
import { fetchPrayerTime, selectPrayerTimesSettings , methods} from '../features/prayerTimes/prayerTimesSlice';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined';
import axios from 'axios';

const getPositionCity =  async (position)=>{
  let city;
  const url = "https://api-adresse.data.gouv.fr/reverse/?lon="+ position.longitude + "&lat= "+ position.latitude
  city = await axios.get(url).then(response=>{
      return {city:response.data.features[0].properties.city, mode:true};
  }).catch(()=>{
      return "error";
  })
  return city.city;
}

export default function TopBar() {
  const [isSettingsOpen, setIsSettingsOpen] =React.useState(false);
  const settings = useSelector(selectPrayerTimesSettings);
  const [localSettings, setLocalSettings] = useState(settings);
  const dispatch = useDispatch()

  const openSettings=()=>{
    setLocalSettings(settings);
    setIsSettingsOpen(true);
  }

  const handleModeChange = ()=>{
      if(!localSettings.mode){
        try {
          navigator.geolocation.getCurrentPosition((position)=>{
            getPositionCity({latitude: position.coords.latitude, longitude: position.coords.longitude}).then((response)=>{
              setLocalSettings({...localSettings, mode:true, city: response});
            }) ;
            
          })
        } catch (error) {
          alert("Impossible d'accéder à la position, vérifier votre réseau et authorisez la géolocalisation de votre appareil");
        }
          
      }else{
          setLocalSettings({...localSettings, mode:false});
      }
  }

  const handleSetCity = (e)=>{
      setLocalSettings({...localSettings, city: e.target.value});
  }

  const handleMethodChange = (e)=>{
      let newMethod;
      switch (e.target.value) {
          case "uoif":
                  newMethod = methods.uoif;
              break;
          case "degre18":
                  newMethod = methods.degre18;
              break;
          case "degre15":
                  newMethod = methods.degre15;
              break;
          default:
              newMethod = methods.parisMosque;
              break;
        }
      setLocalSettings({...localSettings, methodSettings :newMethod});
  }

  const handleTuneChange = (e)=>{
      const {name, value} = e.target;
      switch (name) {
          case "fajr":
              setLocalSettings({...localSettings, tune:{...localSettings.tune, fajr : value}});
              break;
              case "dhuhr":
                  setLocalSettings({...localSettings, tune:{...localSettings.tune, dhuhr : value}});
                  break;
                  case "asr":
                      setLocalSettings({...localSettings, tune:{...localSettings.tune, asr : value}});
                      break;
                      case "maghrib":
                          setLocalSettings({...localSettings, tune:{...localSettings.tune, maghrib : value}});
                          break;
                          case "isha":
                              setLocalSettings({...localSettings, tune:{...localSettings.tune, isha : value}});
                              break;
      }
      // dispatch(changeTune(tune));
  }

  const handlers = {
    handleTuneChange: handleTuneChange,
    handleMethodChange: handleMethodChange,
    handleModeChange: handleModeChange,
    handleSetCity: handleSetCity
  }

  const closeSettings=()=>{
    setIsSettingsOpen(false);
    let options ={
      options:localSettings,
      mode:"refresh"
    }
    dispatch(fetchPrayerTime(options));
  }

    // check if window is standalon (PWA)
        const checkIfStandalone = ()=>{
            if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
            }else{
            return false;
            }
        }
        const isStandalone= checkIfStandalone();
    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={2} sx={{backgroundColor: '#092129'}}>
        <Toolbar>
          <Typography variant="h4" sx={{ textDecoration: 'none', color: 'white'}}>
            Iqama
          </Typography>
          <Box sx={{flexGrow: 1}}/>
          {settings.mode ? <LocationOnOutlinedIcon/> : <LocationOffOutlinedIcon/> }
          <Typography variant="h6" sx={{textDecoration: 'none', color: 'white', marginRight:'1rem'}}>
            {settings.city}
          </Typography>
          
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
            sx={{color:'white'}}
            onClick={openSettings}
          >
            <SettingsOutlinedIcon  />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar/>
      <SettingDialog localSettings={localSettings} callbacks={handlers} open={isSettingsOpen} onClose={closeSettings}/>
    </Box>
  );
}

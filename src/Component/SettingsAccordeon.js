import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormControl, FormControlLabel, Radio, RadioGroup, Switch, TextField } from '@mui/material';
import {makeStyles} from '@mui/styles';

const useStyles = makeStyles({
    input:{
        color:'white'
    }
})


export default function SettingsAccordeon(props) {
    const classes = useStyles();
    const {localSettings, callbacks} = props;
    let currentMethod;
    switch (localSettings.methodSettings) {
        case "12,null,12":
            currentMethod = "uoif"
            break;
        case "18,null,18":
                currentMethod = "degre18"
                break;
        case "15,null,15":
            currentMethod = "degre15"
            break;
        case "18,null,15":
            currentMethod = "parisMosque"
            break;
    }
    const [method, setMethod] = useState(currentMethod)

    const handleMethodChange = (e)=>{
        setMethod(e.target.value);
        callbacks.handleMethodChange(e)
    }

    return (
        <div >
        {/* Location */}
        <Accordion sx={{backgroundColor:'#092129', color:'white'}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
            <Typography>Position ({localSettings.city})</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FormControl>
                    <FormControlLabel control={<Switch checked={localSettings.mode} onClick={callbacks.handleModeChange}/>} label="Utiliser la localisation actuelle" />
                    <TextField color="success" inputProps={{className:classes.input}} label="Localité" onChange={callbacks.handleSetCity} variant="standard" name="cityName" disabled={localSettings.mode} value={localSettings.city} />
                </FormControl>
                
            </AccordionDetails>
        </Accordion>
        {/* Calculation method */}
        <Accordion sx={{backgroundColor:'#092129', color:'white'}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}
            aria-controls="panel2a-content"
            id="panel2a-header"
            >
            <Typography>Méthode de calcul</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{color:'white'}}>
                <FormControl component="fieldset">
                    <RadioGroup
                        aria-label="methods"
                        name="method-radio-buttons-group"
                        value={method}
                        onChange={handleMethodChange}
                    >
                        <FormControlLabel value="uoif" control={<Radio sx={{color:'white'}}/>} label="UOIF" />
                        <FormControlLabel value="parisMosque" control={<Radio sx={{color:'white'}}/>} label="Mosquée de Paris" />
                        <FormControlLabel value="degre18" control={<Radio sx={{color:'white'}}/>} label="18ème degré" />
                        <FormControlLabel value="degre15" control={<Radio sx={{color:'white'}}/>} label="15ème degré" />
                    </RadioGroup>
                </FormControl>
            </AccordionDetails>
        </Accordion>
        {/* Adjustment */}
        <Accordion sx={{backgroundColor:'#092129', color:'white'}}>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{color:'white'}}/>}
            aria-controls="panel3a-content"
            id="panel3a-header"
            >
            <Typography>Ajustements</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{color:'white'}}>
                <FormControl sx={{margin:'auto'}}>
                    <TextField color='success' focused value={localSettings.tune.fajr} name="fajr" variant="standard" label="Fajr" type="number" inputProps={{step:1, className:classes.input}} onChange={callbacks.handleTuneChange}/>
                    <TextField color='success' focused value={localSettings.tune.dhuhr} name="dhuhr" variant="standard" label="Dhuhr" type="number" inputProps={{step:1, className:classes.input}} onChange={callbacks.handleTuneChange}/>
                    <TextField color='success' focused value={localSettings.tune.asr} name="asr" variant="standard" label="Asr" type="number" inputProps={{step:1, className:classes.input}} onChange={callbacks.handleTuneChange}/>
                    <TextField color='success' focused value={localSettings.tune.maghrib} name="maghrib" variant="standard" label="Maghrib" type="number" inputProps={{step:1, className:classes.input}} onChange={callbacks.handleTuneChange}/>
                    <TextField color='success' focused value={localSettings.tune.isha} name="isha" variant="standard" label="Isha" type="number" inputProps={{step:1, className:classes.input}} onChange={callbacks.handleTuneChange}/>
                </FormControl>
            </AccordionDetails>
        </Accordion>
        </div>
    );
}

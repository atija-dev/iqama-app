import { Paper, Typography, Divider, Grid, Box, IconButton, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectPrayerTimes } from '../features/prayerTimes/prayerTimesSlice';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import Countdown from 'react-countdown';
import { useTheme } from '@mui/material';

const timeToDate = (date,time) =>{
    const hours = Number(time.substring(0,2));
    const minutes = Number(time.substring(3,5));
    if (date){
        return new Date(date.setHours(hours,minutes,0));
    }else{
        return new Date(new Date().setHours(hours,minutes,0));
    }
    
}

export const PrayerCard = (props)=>{
    const theme = useTheme();
    const matchesMedium = useMediaQuery(theme.breakpoints.down('md'));
    const prayerTimes = useSelector(selectPrayerTimes);
    let formatedDate = new Date(props.prayerDate.year, props.prayerDate.month, props.prayerDate.day).toLocaleDateString("fr-FR",{ year: 'numeric', month: 'long', day: 'numeric' });
    let chosenDate = new Date(props.prayerDate.year, props.prayerDate.month, props.prayerDate.day,0,0,0,0);
    const currentTime = new Date();
    let currentPrayerTimes;
    let prayerList = [];
    let isNextPrayerDate;
    
    if(prayerTimes.length>0){
        console.log(prayerTimes);
        let timings = prayerTimes[props.prayerDate.month][props.prayerDate.day - 1].timings
        currentPrayerTimes = {
            fajr : timings.Fajr.substring(0,5),
            dhuhr : timings.Dhuhr.substring(0,5),
            asr : timings.Asr.substring(0,5),
            maghrib : timings.Maghrib.substring(0,5),
            isha : timings.Isha.substring(0,5)
        }
        for(const [key,value] of Object.entries(currentPrayerTimes)){
            prayerList.push({key:key, value:value});
        }
        
        if(currentTime.getTime() < timeToDate(new Date(),currentPrayerTimes.fajr).getTime() ){
            currentPrayerTimes.nextPrayer = timeToDate(new Date(),currentPrayerTimes.fajr);
        }else if(currentTime.getTime() < timeToDate(new Date(),currentPrayerTimes.dhuhr).getTime()  && currentTime.getTime() > timeToDate(new Date(),currentPrayerTimes.fajr).getTime() ){
            currentPrayerTimes.nextPrayer = timeToDate(new Date(),currentPrayerTimes.dhuhr);
        }else if(currentTime.getTime() < timeToDate(new Date(),currentPrayerTimes.asr).getTime()  && currentTime.getTime() > timeToDate(new Date(),currentPrayerTimes.dhuhr).getTime()){
            currentPrayerTimes.nextPrayer = timeToDate(new Date(),currentPrayerTimes.asr);
        }else if(currentTime.getTime() < timeToDate(new Date(),currentPrayerTimes.maghrib).getTime()  && currentTime.getTime() > timeToDate(new Date(),currentPrayerTimes.asr)){
            currentPrayerTimes.nextPrayer = timeToDate(new Date(),currentPrayerTimes.maghrib);
        }else if(currentTime.getTime() < timeToDate(new Date(),currentPrayerTimes.isha).getTime()  && currentTime.getTime() > timeToDate(new Date(),currentPrayerTimes.maghrib).getTime()){
            currentPrayerTimes.nextPrayer = timeToDate(new Date(),currentPrayerTimes.isha);
        }else if(currentTime.getTime() > timeToDate(new Date(),currentPrayerTimes.isha).getTime()){
            const nextDay = new Date(currentTime.setDate(currentTime.getDate()+1));
            currentPrayerTimes.nextPrayer = timeToDate(nextDay,prayerTimes[nextDay.getMonth()][nextDay.getDate() - 1].timings.Fajr.substring(0,5));
        }

        isNextPrayerDate = currentPrayerTimes.nextPrayer.toLocaleDateString() === new Date(chosenDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(),currentTime.getMilliseconds())).toLocaleDateString();

    }
    
    if(prayerTimes.length>0){
        return(
            <Paper elevation={3} sx={{backgroundColor: '#092129', minHeight:'400px', borderRadius:'20px', padding:'1rem 2rem', margin:'2rem auto'}}>
                <IconButton onClick={props.prevDayCallBack}><ArrowBackIosRoundedIcon sx={{color:"white", margin:'1rem'}} /></IconButton>
                <Typography variant={matchesMedium ? 'h5' : 'h3'} component="span" sx={{margin:'0 auto 1rem auto'}} color='floralwhite'>{formatedDate}</Typography>
                <IconButton onClick={props.nextDayCallBack} ><ArrowForwardIosRoundedIcon sx={{color:"white", margin:'1rem'}} /></IconButton>
                {!isNextPrayerDate && <Box>
                    <Typography variant='subtitle1' component="h3" sx={{margin:'auto'}} color='#17B169'>
                        <Typography variant='subtitle1' component="h3" sx={{margin:'auto'}} color='floralwhite'>
                            Prochaine Salat le {currentPrayerTimes.nextPrayer.toLocaleDateString()} à {currentPrayerTimes.nextPrayer.toLocaleTimeString().substring(0,5)}
                        </Typography>
                        {"Adhan dans : "} 
                        <Countdown
                            date={currentPrayerTimes.nextPrayer}
                            intervalDelay={0}
                            precision={0}
                        />
                    </Typography>
                </Box>}
                <Divider sx={{backgroundColor:'white'}}/>
                {prayerList.map((item) =>{
                    let isNextPrayer = currentPrayerTimes.nextPrayer.getTime() === timeToDate(new Date(chosenDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds(),currentTime.getMilliseconds())),item.value).getTime();
                    return ( 
                        <Box sx={{marginTop:'1rem'}}>
                            { isNextPrayer ?
                                <Grid item container direction="row" sx={{backgroundColor:'#006A4E', borderRadius: '1rem', padding: '1rem'}}>
                                    <Grid item  sm={6}>
                                        {/* <Grid item > */}
                                            <Typography variant='h4' component="h3" sx={{margin:'auto', display: 'block'}} color='floralwhite'>{item.key}</Typography>
                                            <Typography variant='p' component="h3" sx={{margin:'auto', }} color='floralwhite'>
                                                <Countdown
                                                    date={currentPrayerTimes.nextPrayer}
                                                    intervalDelay={0}
                                                    precision={0}
                                                />
                                            </Typography>
                                        {/* </Grid>                                 */}
                                    </Grid>
                                    <Grid item  sm={6}>
                                        <Typography variant='h4' component="span" sx={{margin:'auto'}} color='floralwhite'>{item.value}</Typography>
                                    </Grid>
                                </Grid>
                                :
                                <Grid item container direction="row" >
                                    <Grid item container sm={6}>
                                        {/* <Grid item > */}
                                            <Typography variant='h4' component="span" sx={{margin:'auto'}} color='floralwhite'>{item.key}</Typography>
                                        {/* </Grid>                                 */}
                                    </Grid>
                                    <Grid item container sm={6}>
                                        <Typography variant='h4' component="span" sx={{margin:'auto'}} color='floralwhite'>{item.value}</Typography>
                                    </Grid>
                                </Grid>
                            }   
                        </Box>
                    )
                })}
                
            </Paper>
        )
    }else{
        return <Typography variant='h4' component="span" sx={{margin:'auto'}} color='floralwhite'>loading</Typography>
    }
    
}
import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PrayerCard } from './PrayerCard';
import {fetchPrayerTime, selectPrayerTimesStatus, selectPrayerTimesSettings} from '../features/prayerTimes/prayerTimesSlice';

export const MainContent = ()=>{
    const dispatch = useDispatch();
    const settings = useSelector(selectPrayerTimesSettings);
    const status = useSelector(selectPrayerTimesStatus);
    const today=new Date();
    const [date, setDate] = useState({day: today.getDate(), month: today.getMonth(), year : today.getFullYear()});
    

    useEffect(()=>{
        let options = {
            options: settings,
            mode: null
        }
        dispatch(fetchPrayerTime(options));
    },[])

    const nextDay = ()=>{
        let nextDay = new Date(date.year, date.month, date.day);
        nextDay.setDate(nextDay.getDate() + 1);
        setDate({day: nextDay.getDate(), month: nextDay.getMonth(), year : nextDay.getFullYear()});
    }

    const previousDay = ()=>{
        let prevDay = new Date(date.year, date.month, date.day);
        prevDay.setDate(prevDay.getDate() - 1);
        setDate({day: prevDay.getDate(), month: prevDay.getMonth(), year : prevDay.getFullYear()});
    }

    if(status === "idle" || status === "success" ){
        return(
            <Grid container direction='row' justifyContent="center">
                <Grid item sm={2} />
                <Grid item sm={8} sx={{minHeight:'400px'}}>
                    <PrayerCard prayerDate={date} nextDayCallBack={nextDay} prevDayCallBack={previousDay} />
                </Grid>
                <Grid item sm={2} />
            </Grid>
        )
    }else{
        return(
            <Grid container direction='row'>
                <Grid item sm={3} />
                <Grid item sm={6} sx={{height:'400px'}}>
                    Loading...
                </Grid>
                <Grid item sm={3} />
            </Grid>
        )
    }
    

}
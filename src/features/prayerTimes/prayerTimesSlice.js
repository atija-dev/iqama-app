import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import {db} from '../../app/indexDb';

// async thunk to handle any async logic and forward result to extrareducers

export const methods = {
    uoif: "12,null,12",
    degre15: "15, null, 15",
    degre18: "18,null,18",
    parisMosque: "18,null,15"
}

const defaultSettings={
        mode: false,
        country: "FR",
        latitude: 0,
        longitude: 0,
        city: "Verneuil sur Seine",
        method: 99,
        methodSettings:"18,null,15",
        tune: {
            imsak: 0,
            fajr:-5,
            sunrise:1,
            dhuhr:5,
            asr:0,
            maghrib:1,
            sunset:0,
            isha:4,
            midnight:0
        }
}

// already exported
export const fetchPrayerTime = createAsyncThunk("prayerTimes/fetchPrayerTime", async (settings)=>{
    const {options, mode}= settings;
    let usedOptions = !mode ? defaultSettings : options;

    //select options from action or cache
    if(!mode){
        let localSettings = await db.last_settings.get("last_settings");
        if(localSettings){
            usedOptions = localSettings.data;
        }
    }

    //build url
    let baseUrl = "";
    let year = new Date().getFullYear()
    let tune = usedOptions.tune.imsak + "," + usedOptions.tune.fajr + "," + usedOptions.tune.sunrise + "," + usedOptions.tune.dhuhr + "," + usedOptions.tune.asr + "," + usedOptions.tune.maghrib + "," + usedOptions.tune.sunset + "," + usedOptions.tune.isha + "," + usedOptions.tune.midnight
    baseUrl = "http://api.aladhan.com/v1/calendarByCity?city=" + usedOptions.city + "&country=" + usedOptions.country +  "&year="+year+"&annual=true"+"&method="+usedOptions.method+"&methodSettings="+usedOptions.methodSettings+"&tune="+tune;

    //if data are cached then no network call
    if(!mode){
        let localData = await db.prayer_times.get(year);
        if(localData){
            return {data:localData.data, newSettings:usedOptions};
        }else{
            console.log('no local calendar data')
        }
    }

    // fetch data from network
    let data = await axios.get(baseUrl).then(async response=>{
        if(response.status === 200){
            return response.data.data;
        }
    }).catch(()=>{
        return "fetching error";
    })

    

    

    //return data if available
    if(data){
        if(data !== "fetching error"){
            //format data for indexDb
            let dbData ={
                id: year,
                data: data
            }
            //save in indexDb
            db.prayer_times.put(dbData, year).then(result=>{
                console.log("calendar saved in cache");
            }).catch((error)=>{
                console.log(error.message);
            });
            return {data: data, newSettings:usedOptions}
        }else{
            return "error"
        }
    }else{
        return "error";
    }
})

export const prayerTimesSlice = createSlice({
    name: 'prayerTimes',
    initialState: {
        data:[],
        settings:{
            mode: false,
            country: "FR",
            latitude: 0,
            longitude: 0,
            city: "",
            method: 99,
            methodSettings:"18,null,15",
            tune: {
                imsak: 0,
                fajr:0,
                sunrise:0,
                dhuhr:0,
                asr:0,
                maghrib:0,
                sunset:0,
                isha:0,
                midnight:0
            }
        },
        status:"idle"
    },

    // extra reducer to handle the result of async thunks
    extraReducers: builder => {
        builder
        //pending handler
        .addCase(fetchPrayerTime.pending, (state) => {
            // handle status
            state = {...state, status: "loading"};
        })
        // fulfilled handler (can be a failure too !)
        .addCase(fetchPrayerTime.fulfilled, (state, action) => {
            // handle response
            console.log(action.payload)
            if(typeof(action.payload) === "object"){
                let newData = [];
                for(const [key,value] of Object.entries(action.payload.data)){
                    newData.push(value);
                }
                //update state
                state = {...state, data:newData, settings:action.payload.newSettings};
                state.status = "success";

                //save settings
                db.last_settings.put({data:action.payload.newSettings, id: "last_settings"}, "last_settings").then(result=>{
                    console.log("settings saved in cache");
                }).catch((error)=>{
                    console.log(error.message);
                });

                //return state
                return state
            }else{
                state.status = "failure"
                console.log("oops failure...");
            }
        })
        .addCase(fetchPrayerTime.rejected, (state, action) => {
            // handle status change
            state.status = "failure"
            console.log("oops rejected...");
        })
    }
})

// export of actions (reducers / async thunks)
export const { changeMethod, changeTune } = prayerTimesSlice.actions

// export of selectors for components perusals
export const selectPrayerTimes = state => state.prayerTimes.data;
export const selectPrayerTimesSettings = state => state.prayerTimes.settings;
export const selectPrayerTimesStatus = state => state.prayerTimes.status;

// export of reducer for /src/app/store.js
export default prayerTimesSlice.reducer


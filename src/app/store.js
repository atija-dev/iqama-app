/*
here to create redux store based on all the slices imported bellow
*/

// toolkit for handle the heavy lifting of redux
import { configureStore } from '@reduxjs/toolkit'
// here all the slices to use
import prayerTimesReducer from '../features/prayerTimes/prayerTimesSlice';

//export the configured store to use in index.js
export default configureStore({
  reducer: {
    // here list all imported reducers
    prayerTimes: prayerTimesReducer
  }
})
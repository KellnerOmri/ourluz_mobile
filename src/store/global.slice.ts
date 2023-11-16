import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {GlobalSliceModel} from "../models/global-slice.model";
import {EventModel} from "../models/event.model";
import {SelectedPage, SelectedPopup} from "../utils/enum.const";
import {RollModel} from "../models/roll.model";
import {UserModel} from "../models/user.model";
import {CalendarModeModel} from "../models/calendar-mode.model";


const initialState: GlobalSliceModel = {
    calendarModeModel: CalendarModeModel.WEEK,
    isEnglish: false,
    selectedPopup: SelectedPopup.Close,
    selectedPage: SelectedPage.MainPanel,
    eventList: {},
    rollList: [],
    selectedEvent: undefined,
    isMobile: false,
    userList: [],
    isAdmin: false,
    currentUser: undefined,
    slotSelected: undefined,
    weekDates: {start: undefined, end: undefined},
    weeklyEventList: {},
    dateCalendarTypeAvailable: CalendarModeModel.WEEK
};
export const globalSlice = createSlice({
    name: "global", initialState: initialState, reducers: {
        setIsEnglish: (state, action: PayloadAction<boolean>) => {
            state.isEnglish = action.payload;
        },
        setEventList: (state, action: PayloadAction<{ [key: string]: EventModel }>) => {
            state.eventList = action.payload;
        },
        setSelectedEvent: (state, action: PayloadAction<EventModel | undefined>) => {
            state.selectedEvent = action.payload;
        },
        setSelectedPopup: (state, action: PayloadAction<SelectedPopup>) => {
            state.selectedPopup = action.payload;
        },
        setSelectedPage: (state, action: PayloadAction<SelectedPage>) => {
            state.selectedPage = action.payload;
        },
        setIsMobile: (state, action: PayloadAction<boolean>) => {
            state.isMobile = action.payload;
        },
        setRollList: (state, action: PayloadAction<RollModel[]>) => {
            state.rollList = action.payload;
        },
        setUserList: (state, action: PayloadAction<UserModel[]>) => {
            state.userList = action.payload;
        },
        setIsAdmin: (state, action: PayloadAction<boolean>) => {
            state.isAdmin = action.payload;
        },
        setCurrentUser: (state, action: PayloadAction<UserModel | undefined>) => {
            state.currentUser = action.payload;
        },
        setSlotSelected: (state, action: PayloadAction<{ start: Date, end: Date } | undefined>) => {
            state.slotSelected = action.payload;
        }
        ,
        setWeekDates: (state, action: PayloadAction<{ start: string | Date | undefined, end: string | Date | undefined }>) => {
            state.weekDates = action.payload;
        },
        setWeeklyEventList: (state, action: PayloadAction<{ [key: string]: EventModel }>) => {
            state.weeklyEventList = action.payload;
        },
        setCalendarModeModel: (state, action: PayloadAction<CalendarModeModel>) => {
            state.calendarModeModel = action.payload;
        },
        setDateCalendarTypeAvailable: (state, action: PayloadAction<CalendarModeModel>) => {
            state.dateCalendarTypeAvailable = action.payload;
        },
    },
});

export const {
    setCalendarModeModel,
    setIsEnglish,
    setEventList,
    setSelectedEvent,
    setSelectedPopup,
    setSelectedPage,
    setIsMobile,
    setRollList,
    setUserList,
    setIsAdmin,
    setCurrentUser,
    setSlotSelected,
    setWeekDates,
    setWeeklyEventList,
    setDateCalendarTypeAvailable
} = globalSlice.actions;

export default globalSlice.reducer;

import React, {JSX, useMemo, useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CalendarMonth} from "./CalendarMonth";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {colors} from "../../../../utils/colors";
import {useAppSelector} from "../../../../app/hooks";
import {setCalendarModeModel} from "../../../../store/global.slice";
import {useDispatch} from "react-redux";
import {CalendarWeek} from "./CalendarWeek";
import {convertToTwoDigitsDate, getFirstDayOfWeek, getLastDateOfWeek} from "../../../../utils/general";

export const Calendar = () => {
    const {calendarModeModel} = useAppSelector(state => state.global)
    const dispatch = useDispatch()
    const [isSelectedDay, setSelectedDate] = useState<boolean>(false);
    const [currentDay, setCurrentDay] = useState<Date | undefined>(undefined);
    const weekdays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
    const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    const changeCurrentDay = (day: { year: number; month: number; number: number }) => {
        setSelectedDate(true);
        setCurrentDay(new Date(day.year, day.month, day.number));
    };

    const currentDate: Date = new Date();


    const nextMonth = () => {
        const curDate = currentDay ? currentDay : new Date();
        setCurrentDay(new Date(curDate.getFullYear(), curDate.getMonth() + 1));
        setSelectedDate(false);
    };

    const previousMonth = () => {
        const curDate = currentDay ? currentDay : new Date();
        setCurrentDay(new Date(curDate.getFullYear(), curDate.getMonth() - 1));
        setSelectedDate(false);
    };
    const nextWeek = () => {
        const curDate = currentDay ? currentDay : new Date();
        const nextWeekDate = new Date(curDate);
        nextWeekDate.setDate(nextWeekDate.getDate() + 7)
        setCurrentDay(nextWeekDate);
        setSelectedDate(false);
    };
    const previousWeek = () => {
        const curDate = currentDay ? currentDay : new Date();
        const prevWeekDate = new Date(curDate);
        prevWeekDate.setDate(prevWeekDate.getDate() - 7)
        setCurrentDay(prevWeekDate);
        setSelectedDate(false);
    };
    const nextDay = () => {
        const curDate = currentDay ? currentDay : new Date();
        const nextWeekDate = new Date(curDate);
        nextWeekDate.setDate(nextWeekDate.getDate() + 1)
        setCurrentDay(nextWeekDate);
        setSelectedDate(false);
    };
    const previousDay = () => {
        const curDate = currentDay ? currentDay : new Date();
        const prevWeekDate = new Date(curDate);
        prevWeekDate.setDate(prevWeekDate.getDate() - 1)
        setCurrentDay(prevWeekDate);
        setSelectedDate(false);
    };

    const firstDayOfMonth = useMemo(() => {
        return currentDay ? new Date(currentDay.getFullYear(), currentDay.getMonth(), 1) : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    }, [currentDay])

    const styles = StyleSheet.create({
        calendarContainer: {
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
        }, weekDays: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between"
        }, selectCalendarModeButtons: {
            width: "40%",
            marginTop: 2,
            display: "flex",
            flexDirection: "row",
            borderStyle: "solid",
            borderWidth: 0.5,
            borderRadius: 4,
            height: 30,
            borderColor: colors.darkGrey,
        }, selectDateModeBtn: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
        },
        verticalLine: {
            width: 0.5,
            backgroundColor: colors.darkGrey
        }, calendarHeader: {
            paddingHorizontal: "5%",
            paddingVertical: "2%",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
        }, displayDateStyle: {
            width: "50%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center"
        }, arrowDate: {
            backgroundColor: colors.lightSkyBlue,
            borderRadius: 8,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center"
            , justifyContent: "center"
        }
    });
    const NEXT = ">"
    const PREV = "<"

    const firstDayOfWeek: Date = useMemo(() => {
        return getFirstDayOfWeek(currentDay ?? currentDate);
    }, [currentDay, currentDate])
    console.log(firstDayOfWeek, "firstDayOfWeek")

    const renderHeader = (header: string, nextDate: any, prevDate: any): JSX.Element => {
        return <View style={styles.displayDateStyle}>
            <TouchableOpacity style={styles.arrowDate} onPress={prevDate}><Text>{PREV}</Text></TouchableOpacity>
            <Text>{header}</Text>
            <TouchableOpacity style={styles.arrowDate} onPress={nextDate}><Text>{NEXT}</Text></TouchableOpacity>
        </View>
    }
    const renderCalendarHeader = (): JSX.Element => {
        switch (calendarModeModel) {
            case CalendarModeModel.DAY:
                return renderHeader(`${months[(currentDay ?? currentDate).getMonth()]} ${convertToTwoDigitsDate((currentDay ?? currentDate).getDate())}`, nextDay, previousDay)
            case CalendarModeModel.WEEK:
                return renderHeader(`${months[firstDayOfWeek.getMonth()]} ${convertToTwoDigitsDate(getLastDateOfWeek(firstDayOfWeek).getDate())} - ${convertToTwoDigitsDate(firstDayOfWeek.getDate())}`, nextWeek, previousWeek)
            case CalendarModeModel.MONTH:
                return renderHeader(`${months[firstDayOfMonth.getMonth()]} ${firstDayOfMonth.getFullYear()}`, nextMonth, previousMonth)
            default:
                return <View></View>
        }

    }

    return <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
            {renderCalendarHeader()}
            <View style={styles.selectCalendarModeButtons}>
                <TouchableOpacity
                    style={[{backgroundColor: calendarModeModel === CalendarModeModel.MONTH ? colors.primary : colors.white}, styles.selectDateModeBtn]}
                    onPress={() => dispatch(setCalendarModeModel(CalendarModeModel.MONTH))}><Text
                    style={{color: calendarModeModel === CalendarModeModel.MONTH ? colors.white : colors.darkGrey}}>חודש</Text></TouchableOpacity>
                <View style={styles.verticalLine}/>
                <TouchableOpacity
                    style={[{backgroundColor: calendarModeModel === CalendarModeModel.WEEK ? colors.primary : colors.white}, styles.selectDateModeBtn]}
                    onPress={() => dispatch(setCalendarModeModel(CalendarModeModel.WEEK))}><Text
                    style={{color: calendarModeModel === CalendarModeModel.WEEK ? colors.white : colors.darkGrey}}>שבוע</Text></TouchableOpacity>
                <View style={styles.verticalLine}/>
                <TouchableOpacity
                    style={[{backgroundColor: calendarModeModel === CalendarModeModel.DAY ? colors.primary : colors.white}, styles.selectDateModeBtn]}
                    onPress={() => dispatch(setCalendarModeModel(CalendarModeModel.DAY))}><Text
                    style={{color: calendarModeModel === CalendarModeModel.DAY ? colors.white : colors.darkGrey}}>יום</Text></TouchableOpacity>
            </View></View>

        {(calendarModeModel === CalendarModeModel.MONTH || calendarModeModel === CalendarModeModel.WEEK)
            &&
            <View style={styles.weekDays}>
                {weekdays.map((weekDay, index) => {
                    const dayIndex = firstDayOfWeek.getDate() + index;
                    return <View style={{width: `${100 / 7}%`}} key={index}>
                        <Text style={{
                            textAlign: "center",
                            width: "100%",
                        }}> {weekDay} {calendarModeModel === CalendarModeModel.WEEK ? convertToTwoDigitsDate(dayIndex) : ""}</Text>
                    </View>
                })}
            </View>}
        {calendarModeModel === CalendarModeModel.MONTH &&
            <CalendarMonth
                dateMode={calendarModeModel}
                currentDay={currentDay}
                isSelectedDay={isSelectedDay}
                changeCurrentDay={changeCurrentDay}
                firstDayOfMonth={firstDayOfMonth}
            />}
        {calendarModeModel === CalendarModeModel.WEEK &&
            <CalendarWeek
                dateMode={calendarModeModel}
                currentDay={currentDay}
                isSelectedDay={isSelectedDay}
                changeCurrentDay={changeCurrentDay}
                firstDayOfWeek={firstDayOfWeek}/>}
    </View>
}
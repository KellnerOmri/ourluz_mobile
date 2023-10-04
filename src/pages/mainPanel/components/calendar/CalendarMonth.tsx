import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {colors} from "../../../../utils/colors";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";

interface CalendarDay {
    currentMonth: boolean;
    date: Date;
    month: number;
    number: number;
    selected: boolean;
    year: number;
}

interface Props {
    currentDay?: Date;
    changeCurrentDay: (day: CalendarDay) => void;
    isSelectedDay: boolean;
    dateMode: CalendarModeModel,
    firstDayOfMonth: Date
}

export const CalendarMonth: React.FC<Props> = props => {


    const DAYS_A_WEEK = 7;
    const DAYS_TO_SHOW = 42;
    const {currentDay, changeCurrentDay, isSelectedDay, firstDayOfMonth} = props;
    const currentDate: Date = currentDay ?? new Date()
    const weekdayOfFirstDay = firstDayOfMonth.getDay();
    const currentDays: CalendarDay[] = [];

    for (let day = 0; day < DAYS_TO_SHOW; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - DAYS_A_WEEK);
        } else if (day === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }

        const calendarDay = {
            currentMonth: firstDayOfMonth.getMonth() === currentDate.getMonth(),
            date: new Date(firstDayOfMonth),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            selected: isSelectedDay && firstDayOfMonth.toDateString() === currentDate.toDateString() && currentDay !== undefined,
            year: firstDayOfMonth.getFullYear(),
        };

        currentDays.push(calendarDay);
    }


    const styles = StyleSheet.create({
        calendarDaysContainer: {
            width: "100%",
            height: "75%",
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            flexWrap: "wrap",
            backgroundColor: colors.lightBlue
        }, dayContainer: {
            height: `${100 / 6}%`,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: `${100 / 7}%`,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.lightSkyBlue,

        }, dateNumber: {
            paddingHorizontal: 3, fontSize: 12
        }
    });


    return <View style={styles.calendarDaysContainer}>
        {currentDays.map(day => (<TouchableOpacity
            style={[{backgroundColor: day.date.getDay() === 6 ? colors.lightSlateBlue : colors.white}, styles.dayContainer]}
            key={moment(day.date).format("yyyy-MM-DD")}
            onPress={() => changeCurrentDay(day)}
        >
            <Text style={[{color: day.currentMonth ? colors.primary : colors.wolf}, styles.dateNumber]}>
                {day.number}
            </Text>
        </TouchableOpacity>))}
    </View>
}
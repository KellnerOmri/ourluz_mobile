import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {getLastDateOfWeek} from "../../../../utils/general";
import {colors} from "../../../../utils/colors";

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
    firstDayOfWeek: Date
}

export const CalendarWeek: React.FC<Props> = props => {
    const {currentDay, changeCurrentDay, isSelectedDay, firstDayOfWeek} = props;
    const currentDate: Date = currentDay ?? new Date()
    const DAYS_A_WEEK = 7;
    let numbers: number[] = Array.from({length: 7}, (_, index) => index + 1);
    console.log(numbers); // Output: [1, 2, 3, 4, 5, 6, 7]
    const lastDayOfWeek: Date = getLastDateOfWeek(firstDayOfWeek);

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            height: "87%"
        }, dayOfWeek: {
            height: "100%",
            width: `${100 / 7}%`,
            borderColor: colors.lightSkyBlue,
            borderStyle: "solid",
            borderWidth: 1,
        }
    });


    return <View style={styles.container}>
        {numbers.map((num, index) => {
            return <View style={styles.dayOfWeek}><Text></Text></View>
        })}
        {/*<Text>{firstDayOfWeek.toISOString()}</Text>*/}
        {/*<Text>{lastDayOfWeek.toISOString()}</Text>*/}
        {/*{getFirstDayOfWeek(currentDate).getMonth()}*/}
        {/*<Text>d{currentDate?.toISOString()}</Text>*/}
    </View>
}
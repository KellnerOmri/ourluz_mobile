import React from "react";
import {StyleSheet, View} from "react-native";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {getLastDateOfWeek} from "../../../../utils/general";
import {colors} from "../../../../utils/colors";
import {EventModel} from "../../../../models/event.model";
import moment from "moment/moment";
import {UserModel} from "../../../../models/user.model";
import {DayInWeek} from "./day-in-week/DayInWeek";

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
    eventsByDates: { [date: string]: EventModel[] },
    currentUser: UserModel | undefined
}

export const CalendarWeek: React.FC<Props> = props => {
    const {eventsByDates, firstDayOfWeek} = props;
    const lastDayOfWeek: Date = getLastDateOfWeek(firstDayOfWeek);
    const generateDateRange = (startDate: Date, endDate: Date): string[] => {
        const dateArray: string[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dateArray.push(currentDate.toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }


        return dateArray;
    }

    const datesArray = generateDateRange(firstDayOfWeek, lastDayOfWeek)
    const styles = StyleSheet.create({
        dayWrapper: {
            width: "100%"
        },
        container: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            height: "100%"
        }, dayOfWeek: {
            height: "100%",
            width: `${100 / 7}%`,
            borderColor: colors.lightSkyBlue,
            borderStyle: "solid",
            borderWidth: 1,
            display: "flex",
            gap: 2
        }, eventContainer: {
            backgroundColor: colors.primary,
            paddingHorizontal: 1.5
        },
        descriptionText: {
            fontSize: 9,
            textAlign: "center",
            color: colors.white,
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            fontWeight: "600"
        }, lineWrapper: {
            display: "flex"
        }, label: {
            color: colors.dark,
            fontSize: 8,
            fontWeight: "600",
            textAlign: "right"
        },
        valueStyle: {
            color: colors.white,
            fontSize: 8,
            textAlign: "right"
        },
        calendarWeekContainer: {
            gap: 5,
            display: "flex",
            alignItems: "flex-end"
        }
    });

    const weekdays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];

    return <View style={styles.calendarWeekContainer}>
        {datesArray.map((day, dayIndex) => {
            const eventInDay = eventsByDates[moment(day).format("yyyy-MM-DD")]
            return <View style={styles.dayWrapper} key={dayIndex}>
                {eventInDay?.length > 0 &&
                    <DayInWeek key={dayIndex} eventInDay={eventsByDates[moment(day).format("yyyy-MM-DD")]}
                               dateLabel={`${weekdays[dayIndex]} ${moment(day).format("MM-DD")}`} dayIndex={dayIndex}/>}
            </View>
        })}
    </View>
}
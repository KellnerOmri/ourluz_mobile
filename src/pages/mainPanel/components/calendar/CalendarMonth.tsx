import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import moment from "moment";
import {colors} from "../../../../utils/colors";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {EventModel} from "../../../../models/event.model";

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
    firstDayOfMonth: Date,
    eventsByDates: { [date: string]: EventModel[] }
}

export const CalendarMonth: React.FC<Props> = props => {

    const DAYS_A_WEEK = 7;
    const DAYS_TO_SHOW = 42;
    const {eventsByDates, currentDay, changeCurrentDay, isSelectedDay, firstDayOfMonth} = props;
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
            width: `${100 / 7}%`,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: colors.lightSkyBlue,

        }, dateNumber: {
            paddingHorizontal: 3, fontSize: 12
        },
        eventName: {
            paddingRight: 2,
            fontSize: 8,
            color: colors.white
        },
        moreEvents: {
            color: colors.primary,
            fontSize: 10
        }
    });

    console.log(eventsByDates, "eventsByDates")
    return <View style={styles.calendarDaysContainer}>
        {currentDays.map((day) => {
            let thereIsEventsInThisDate: EventModel[] = [];
            thereIsEventsInThisDate = eventsByDates[moment(day.date).format("yyyy-MM-DD")];
            console.log(thereIsEventsInThisDate, "thereIsEventsInThisDate")
            return (<TouchableOpacity
                style={[{backgroundColor: day.date.getDay() === 6 ? colors.lightSlateBlue : colors.white}, styles.dayContainer]}
                key={moment(day.date).format("yyyy-MM-DD")}
                onPress={() => {
                    console.log("im change day")
                    changeCurrentDay(day)
                }}
            >
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={[{color: day.currentMonth ? colors.primary : colors.wolf}, styles.dateNumber]}>
                        {day.number}
                    </Text>

                    {thereIsEventsInThisDate && thereIsEventsInThisDate.length > 4 &&
                        <Text style={[{color: day.currentMonth ? colors.primary : colors.wolf}, styles.dateNumber]}>
                            +{thereIsEventsInThisDate.length - 4}
                        </Text>}
                </View>

                {thereIsEventsInThisDate && thereIsEventsInThisDate.length > 0 &&
                    <View style={{width: "100%", display: "flex", gap: 2}}>
                        {thereIsEventsInThisDate.map((e, index) => {
                            return index < 4 ?
                                <TouchableOpacity key={`${moment(day.date).format("yyyy-MM-DD")}-${index}`}
                                                  onPress={() => console.log("click item")}
                                                  style={{backgroundColor: e.backgroundColor}}>
                                    <Text ellipsizeMode={"tail"}
                                          numberOfLines={thereIsEventsInThisDate.length > 2 ? 1 : 2}
                                          style={styles.eventName}>{e.description}</Text></TouchableOpacity>
                                :
                                index === 4 ?
                                    <TouchableOpacity key={`${moment(day.date).format("yyyy-MM-DD")}-${index}`}
                                                      onPress={() => console.log("click item")}
                                    >
                                        <Text ellipsizeMode={"tail"} numberOfLines={1}
                                              style={styles.moreEvents}>{thereIsEventsInThisDate.length - 3} +</Text></TouchableOpacity>
                                    : <View></View>
                        })}
                    </View>
                }
            </TouchableOpacity>)
        })}
    </View>
}
import React from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {getLastDateOfWeek, getUserById} from "../../../../utils/general";
import {colors} from "../../../../utils/colors";
import {EventModel} from "../../../../models/event.model";
import moment from "moment/moment";
import {text} from "../../../../utils/dictionary-management";
import {useDispatch} from "react-redux";
import {setSelectedEvent} from "../../../../store/global.slice";
import {UserModel} from "../../../../models/user.model";

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
    eventsByDates: { [date: string]: EventModel[] }
    currentUser: UserModel | undefined
}

export const CalendarDay: React.FC<Props> = props => {
    const {currentUser, eventsByDates, currentDay, changeCurrentDay, isSelectedDay} = props;
    const currentDate: Date = currentDay ?? new Date()
    const dispatch = useDispatch()
    const styles = StyleSheet.create({
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
            width: `${100}%`,
            borderColor: colors.lightSkyBlue,
            borderStyle: "solid",
            borderWidth: 1,
            display: "flex",
            gap: 2
        }, eventContainer: {
            backgroundColor: colors.primary,
            paddingHorizontal: 5
        },
        descriptionText: {
            fontSize: 14,
            textAlign: "center",
            color: colors.white,
            textDecorationLine: "underline",
            textDecorationStyle: "solid",
            fontWeight: "600"
        }, employeeListContainer: {
            display: "flex"
        }, lineWrapper: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 10
        }, label: {
            alignSelf: "flex-end",
            color: colors.dark,
            fontSize: 14,
            fontWeight: "600"
        },
        valueStyle: {
            color: colors.white,
            fontSize: 14,
            textAlign: "right"
        }
    });

    // console.log(eventsByDates, "eventsByDates")
    let thereIsEventsInThisDate: EventModel[] = [];
    thereIsEventsInThisDate = eventsByDates[moment(currentDay ?? currentDate).format("yyyy-MM-DD")];
    return <View style={styles.container}>
        <View style={styles.dayOfWeek}>
            {thereIsEventsInThisDate && thereIsEventsInThisDate.length ? thereIsEventsInThisDate.map((eventInDay, index) => {
                    const eventUserBooked: { id: number, booked: boolean, roleId: number | null }[] = eventInDay.users.filter((u) => u.booked);
                    return <TouchableOpacity
                        key={index}
                        onPress={() => dispatch(setSelectedEvent(eventInDay))}
                        style={styles.eventContainer}>
                        <Text style={styles.descriptionText}>{eventInDay.description}</Text>
                        <View style={styles.lineWrapper}>
                            <Text style={styles.valueStyle}>{eventInDay.location}</Text>
                            <Text style={styles.label}>{text.location}:</Text>
                        </View>
                        <View style={styles.lineWrapper}>
                            <Text style={styles.valueStyle}>{moment(eventInDay.start).format("HH:mm")}</Text>
                            <Text style={styles.label}>{text.hourTime}:</Text>
                        </View>
                        {eventInDay.comments && eventInDay.comments.length > 0 &&
                            <View style={styles.lineWrapper}>
                                <Text style={styles.valueStyle}>{eventInDay.comments}</Text>
                                <Text style={[styles.label, {color: colors.alert}]}>{text.comments}:</Text>
                            </View>}
                        <View style={styles.employeeListContainer}><Text
                            style={styles.label}>{text.employeeList}:</Text>
                            {eventUserBooked && eventUserBooked.length > 0 && eventUserBooked.map((user, index) => {
                                return <Text
                                    key={index}
                                    style={[styles.valueStyle, {fontSize: 16}]}>{getUserById(user.id)?.firstName} {"." + getUserById(user.id)?.lastName[0]}</Text>
                            })}
                            {eventUserBooked && eventUserBooked.length === 0 &&
                                <Text style={[styles.valueStyle, {fontSize: 12}]}>טרם שובצו עובדים</Text>}
                        </View>
                    </TouchableOpacity>
                }) :
                <Text></Text>}
        </View>
    </View>
}
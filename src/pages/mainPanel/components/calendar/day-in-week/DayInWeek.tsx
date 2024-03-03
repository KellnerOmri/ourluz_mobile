import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {EventModel} from "../../../../../models/event.model";
import {colors} from "../../../../../utils/colors";
import moment from "moment";
import {getUserById} from "../../../../../utils/general";
import {text} from "../../../../../utils/dictionary-management";
import {useDispatch} from "react-redux";
import {setSelectedEvent} from "../../../../../store/global.slice";

export const DayInWeek: React.FC<{ dateLabel: string, eventInDay: EventModel[], dayIndex: number }> = ({
                                                                                                           dateLabel,
                                                                                                           eventInDay,
                                                                                                           dayIndex
                                                                                                       }) => {
    const dispatch = useDispatch();

    const styles = StyleSheet.create({
        container: {
            borderBottomWidth: 1,
            alignItems: "flex-end",
            padding: 5,
            width: "100%"
        },
        dayWrapper: {
            padding: 10,
            marginBottom: 10,
            width: "100%",
            backgroundColor: colors.primary,

            display: "flex",
            alignItems: "flex-end"
        },
        dateLabel: {
            padding: 5,
            fontSize: 20,
            fontWeight: "600",
            color: colors.primary,
            backgroundColor: colors.lightWolf,
            width: "100%",
            display: "flex",
            textAlign: "right"
        },
        row: {
            display: "flex",
            flexDirection: "row",
            gap: 10,
            alignItems: "center"
        },
        label: {
            fontSize: 20
        },
        val: {
            fontSize: 20,
            color: colors.white,
            fontWeight: "600"
        },
        userList: {
            textAlign: "left",
            display: "flex",
            alignItems: "flex-end",
        },
        userNameStyle: {
            fontSize: 16,
            color: colors.white
        }
        , userListItem: {},
    })
    return <View style={styles.container}>

        <Text style={styles.dateLabel}>{dateLabel}</Text>
        {eventInDay?.length > 0 &&
            eventInDay.map((e, index) => {
                const eventUserBooked: { id: number, booked: boolean, roleId: number | null }[] = e.users.filter((u) => u.booked);


                return <TouchableOpacity onPress={() => dispatch(setSelectedEvent(e))} key={`${dayIndex}-${index}`}
                                         style={styles.dayWrapper}>
                    <View style={styles.row}>
                        <Text style={styles.val}>{e.description}</Text>
                        <Text style={styles.label}>{text.description}:</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.val}>{e.location}</Text>
                        <Text style={styles.label}>{text.location}:</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.val}>{moment(e.start).format("HH:mm")}</Text>
                        <Text style={styles.label}>{text.hourTime}:</Text>
                    </View>
                    <View style={styles.row}>
                        {e.comments && <Text style={styles.val}>{e.comments}</Text>}
                        {e.comments && <Text style={[styles.label, {color: colors.alert}]}>{text.comments}:</Text>}
                    </View>
                    <View style={styles.userList}>
                        <Text style={styles.label}>{text.employeeList}:</Text>
                        {eventUserBooked.length > 0 ? <View style={styles.userListItem}>{eventUserBooked.map((us) => {
                                return <Text
                                    style={styles.userNameStyle}>{getUserById(us.id)?.firstName} {"." + getUserById(us.id)?.lastName[0]}</Text>
                            })}</View>
                            : <Text style={styles.val}>טרם שובצו עובדים</Text>}

                    </View>
                </TouchableOpacity>
            })}
    </View>
}
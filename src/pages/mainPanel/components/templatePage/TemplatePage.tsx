import React, {useEffect, useMemo, useState} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {TemplateHeader} from "./TemplateHeader";
import {useAppSelector} from "../../../../app/hooks";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {checkIfUserIsAvailabilityToEvent, getFirstDayOfWeek, getLastDateOfWeek} from "../../../../utils/general";
import moment from "moment";
import {getAllEventsByDates} from "../../../../utils/data-management";
import {AvailableRow} from "./AvailableRow";
import {SelectedPage} from "../../../../utils/enum.const";
import {MyShiftRow} from "./MyShiftRow";

export const TemplatePage: React.FC<{ selectedPage: SelectedPage }> = ({selectedPage}) => {
    const {currentUser, weeklyEventList, dateCalendarTypeAvailable} = useAppSelector(state => state.global)
    const [datesRange, setDatesRange] = useState<{ startDate: string, endDate: string }>({
        startDate: moment(getFirstDayOfWeek(new Date())).format("yyyy-MM-DD"),
        endDate: moment(getLastDateOfWeek(getFirstDayOfWeek(new Date()))).format("yyyy-MM-DD")
    })
    const getLastDateOfMonth = (): Date => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // Months are 0-based in JavaScript

        // To get the first day of the next month, set the day to 0
        // This will result in the last day of the current month
        const lastDayOfMonth = new Date(year, month, 0);
        return lastDayOfMonth;
    }


    useEffect(() => {
        if (dateCalendarTypeAvailable === CalendarModeModel.WEEK) {
            setDatesRange({
                startDate: moment(getFirstDayOfWeek(new Date())).format("yyyy-MM-DD"),
                endDate: moment(getLastDateOfWeek(getFirstDayOfWeek(new Date()))).format("yyyy-MM-DD")
            })
        } else {
            const currentDate = new Date()
            setDatesRange({
                startDate: moment(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)).format("yyyy-MM-DD"),
                endDate: moment(getLastDateOfMonth()).format("yyyy-MM-DD")
            })
        }
    }, [dateCalendarTypeAvailable])


    const getAllEventsFunction = async () => {
        await getAllEventsByDates(datesRange.startDate, datesRange.endDate)
    }
    useEffect(() => {
        getAllEventsFunction().then()
    }, [datesRange])

    console.log(weeklyEventList, "weeklyEventList")


    const styles = StyleSheet.create({
        timeRange: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            padding: 4,
            gap: 10
        },
        rangeText: {
            fontSize: 16,
            fontWeight: "700"
        },
        listOfRowWrapper: {
            width: "100%",
            height: "70%",
            display: "flex",
            gap: 10
        }
    });
    const checkIfUserIsBookedToEvent = (userList: { id: number, booked: boolean, roleId: number | null }[]) => {
        let isBooked = false
        userList.forEach((u) => {
            if (u.id === currentUser?.id && u.booked) {
                isBooked = true
            }
        })
        return isBooked
    }
    const filteredEvents = useMemo(() => {
        if (selectedPage === SelectedPage.MyAvailabilityPage) {
            return Object.keys(weeklyEventList)
                .filter((eventItem) => {
                    return new Date(weeklyEventList[eventItem].start) >= new Date();
                })
        } else if (selectedPage === SelectedPage.MyShiftPage) {
            return Object.keys(weeklyEventList).filter((eventKey) => checkIfUserIsBookedToEvent(weeklyEventList[eventKey]?.users ?? false))
        } else return []

    }, [weeklyEventList])

    const renderItemMyActivity = ({item, index}: { item: string; index: number }) => {
        const eventKey = item;
        return (
            <AvailableRow
                key={index}
                eventDetails={weeklyEventList[eventKey]}
                isAvailable={checkIfUserIsAvailabilityToEvent(
                    currentUser,
                    weeklyEventList[eventKey]?.users
                )}
            />
        );
    };
    const renderItemMyShift = ({item, index}: { item: string; index: number }) => {
        const eventKey = item;
        return (
            <MyShiftRow
                key={index}
                eventDetails={weeklyEventList[eventKey]}
            />
        );
    };

    return <View>
        <TemplateHeader selectedPage={selectedPage}/>
        <View style={styles.timeRange}>
            <Text style={styles.rangeText}>{moment(datesRange.startDate).format("DD/MM/YY")}</Text>
            <Text style={styles.rangeText}>-</Text>
            <Text style={styles.rangeText}>{moment(datesRange.endDate).format("DD/MM/YY")}</Text>
        </View>
        <View style={styles.listOfRowWrapper}>
            {filteredEvents.length > 0 ?
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item}
                    renderItem={selectedPage === SelectedPage.MyShiftPage ? renderItemMyShift : renderItemMyActivity}
                /> :
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 20}}><Text
                    style={{fontSize: 18, fontWeight: "700"}}>אינך משובץ לאירועים בתאריכים אלו</Text></View>}

        </View>
    </View>
}
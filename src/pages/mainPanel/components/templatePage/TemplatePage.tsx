import React, {useEffect, useMemo, useState} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {TemplateHeader} from "./TemplateHeader";
import {useAppSelector} from "../../../../app/hooks";
import {ActionTimeType, CalendarModeModel} from "../../../../models/calendar-mode.model";
import {checkIfUserIsAvailabilityToEvent, getFirstDayOfWeek, getLastDateOfWeek} from "../../../../utils/general";
import moment from "moment";
import {getAllEventsByDates} from "../../../../utils/data-management";
import {AvailableRow} from "./AvailableRow";
import {SelectedPage} from "../../../../utils/enum.const";
import {MyShiftRow} from "./MyShiftRow";
import {colors} from "../../../../utils/colors";

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

    const styles = StyleSheet.create({
        timeRange: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
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
        },
        arrowDate: {
            backgroundColor: colors.lightSkyBlue,
            borderRadius: 8,
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
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
    const NEXT = ">"
    const PREV = "<"

    const changeRangeDate = (actionType: ActionTimeType, timeType: CalendarModeModel.WEEK | CalendarModeModel.MONTH) => {
        switch (timeType) {
            case CalendarModeModel.WEEK: {
                if (actionType === ActionTimeType.NEXT) {
                    let nextWeekStartDate = new Date(datesRange.startDate)
                    nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7)
                    let nextWeekEndDate = new Date(datesRange.endDate)
                    nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 14)
                    setDatesRange({
                        startDate: moment(nextWeekStartDate).format("yyyy-MM-DD"),
                        endDate: moment(nextWeekEndDate).format("yyyy-MM-DD")
                    })
                }
                //prev week
                else {
                    let prevWeekStartDate = new Date(datesRange.startDate)
                    prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 7)
                    let prevWeekEndDate = new Date(datesRange.endDate)
                    prevWeekEndDate.setDate(prevWeekEndDate.getDate() - 14)
                    setDatesRange({
                        startDate: moment(prevWeekStartDate).format("yyyy-MM-DD"),
                        endDate: moment(prevWeekEndDate).format("yyyy-MM-DD")
                    })
                }
            }
                break
            case CalendarModeModel.MONTH: {
                if (actionType === ActionTimeType.NEXT) {
                    let nextMonthStartDate = new Date(datesRange.startDate)
                    nextMonthStartDate.setMonth(nextMonthStartDate.getMonth() + 1)
                    let nextMonthEndDate = new Date(datesRange.endDate)
                    nextMonthEndDate.setMonth(nextMonthEndDate.getMonth() + 1)
                    setDatesRange({
                        startDate: moment(nextMonthStartDate).format("yyyy-MM-DD"),
                        endDate: moment(nextMonthEndDate).format("yyyy-MM-DD")
                    })
                } else {
                    let prevMonthStartDate = new Date(datesRange.startDate)
                    prevMonthStartDate.setMonth(prevMonthStartDate.getMonth() - 1)
                    let prevMonthEndDate = new Date(datesRange.endDate)
                    prevMonthEndDate.setMonth(prevMonthEndDate.getMonth() - 1)
                    setDatesRange({
                        startDate: moment(prevMonthStartDate).format("yyyy-MM-DD"),
                        endDate: moment(prevMonthEndDate).format("yyyy-MM-DD")
                    })
                }
            }
                break
            default:
                return ""
        }
    }
    console.log(datesRange, "dateRange")
    return <View>
        <TemplateHeader selectedPage={selectedPage}/>
        <View style={styles.timeRange}>
            <TouchableOpacity style={styles.arrowDate}
                              onPress={() => changeRangeDate(ActionTimeType.PREV, dateCalendarTypeAvailable === CalendarModeModel.WEEK ? CalendarModeModel.WEEK : CalendarModeModel.MONTH)}><Text>{PREV}</Text></TouchableOpacity>

            <Text style={styles.rangeText}>{moment(datesRange.startDate).format("DD/MM/YY")}</Text>
            <Text style={styles.rangeText}>-</Text>
            <Text style={styles.rangeText}>{moment(datesRange.endDate).format("DD/MM/YY")}</Text>

            <TouchableOpacity style={styles.arrowDate}
                              onPress={() => changeRangeDate(ActionTimeType.NEXT, dateCalendarTypeAvailable === CalendarModeModel.WEEK ? CalendarModeModel.WEEK : CalendarModeModel.MONTH)}><Text>{NEXT}</Text></TouchableOpacity>
        </View>
        <View style={styles.listOfRowWrapper}>
            {filteredEvents.length > 0 ?
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item}
                    renderItem={selectedPage === SelectedPage.MyShiftPage ? renderItemMyShift : renderItemMyActivity}
                />
                :
                <View style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 20}}><Text
                    style={{fontSize: 18, fontWeight: "700"}}>אינך משובץ לאירועים בתאריכים אלו</Text></View>
            }

        </View>
    </View>
}
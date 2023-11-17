import React, {JSX, useEffect, useMemo, useState} from "react";
import {Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CalendarMonth} from "./CalendarMonth";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {colors} from "../../../../utils/colors";
import {useAppSelector} from "../../../../app/hooks";
import {setCalendarModeModel, setSelectedEvent} from "../../../../store/global.slice";
import {useDispatch} from "react-redux";
import {CalendarWeek} from "./CalendarWeek";
import {
    checkIfUserIsAvailabilityToEvent,
    convertToTwoDigitsDate,
    getFirstDayOfWeek,
    getLastDateOfWeek,
    getStatusEventForClient
} from "../../../../utils/general";
import {
    createEventDictionary,
    removeAvailabilityFromEvent,
    setAvailabilityToEvent
} from "../../../../utils/data-management";
import {EventModel} from "../../../../models/event.model";
import {CalendarDay} from "./CalendarDay";
import {text} from "../../../../utils/dictionary-management";
import moment from "moment";
import {UserEventStatus} from "../../../../utils/enum.const";

export const Calendar = () => {
    const [openBookedModal, setOpenBookedModal] = useState(true)
    const {
        calendarModeModel,
        weeklyEventList,
        eventList,
        selectedEvent,
        currentUser
    } = useAppSelector(state => state.global)
    const dispatch = useDispatch()
    const [isSelectedDay, setSelectedDate] = useState<boolean>(false);
    const [currentDay, setCurrentDay] = useState<Date>(new Date());
    const weekdays = ["א׳", "ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳"];
    const months = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
    const changeCurrentDay = (day: { year: number; month: number; number: number }) => {
        setSelectedDate(true);
        setCurrentDay(new Date(day.year, day.month, day.number));
    };
    useEffect(() => {
        if (selectedEvent) {
            setOpenBookedModal(true)
        } else {
            setOpenBookedModal(false)
        }
    }, [selectedEvent])
    const currentDate: Date = new Date();
    const eventsByDates: { [date: string]: EventModel[] } = createEventDictionary(Object.values(eventList));

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


    const NEXT = ">"
    const PREV = "<"

    const firstDayOfWeek: Date = useMemo(() => {
        return getFirstDayOfWeek(currentDay ?? currentDate);
    }, [currentDay])

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
    const isAvailable = useMemo(() => {
        return checkIfUserIsAvailabilityToEvent(
            currentUser,
            weeklyEventList[(selectedEvent as EventModel)?.id]?.users
        )
    }, [selectedEvent])

    const [selectedAvailabilityEvent, setSelectedAvailabilityEvent] = useState(isAvailable ? UserEventStatus.available : UserEventStatus.nothing)

    useEffect(() => {
        setSelectedAvailabilityEvent(isAvailable ? UserEventStatus.available : UserEventStatus.nothing)
    }, [selectedEvent])

    const addAvailabilityEvent = async () => {
        await setAvailabilityToEvent((selectedEvent as EventModel).id).then()
        setSelectedAvailabilityEvent(UserEventStatus.available)
    }
    const removeAvailabilityEvent = async () => {
        await removeAvailabilityFromEvent((selectedEvent as EventModel).id).then()
        setSelectedAvailabilityEvent(UserEventStatus.nothing)

    }
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
        }, eventDetailsContainer: {
            display: "flex",
            alignItems: "center"
        }, eventDetailsLine: {
            justifyContent: "flex-end",
            display: "flex",
            flexDirection: "row",
            gap: 10
        },
        eventDetailsLabel: {textAlign: "right"},
        eventDetailsValue: {}
    });
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
                eventsByDates={eventsByDates}
                currentUser={currentUser}
            />}
        {calendarModeModel === CalendarModeModel.WEEK &&
            <ScrollView style={{height: "100%", width: "100%"}}>
                <CalendarWeek
                    dateMode={calendarModeModel}
                    currentDay={currentDay}
                    isSelectedDay={isSelectedDay}
                    changeCurrentDay={changeCurrentDay}
                    firstDayOfWeek={firstDayOfWeek}
                    eventsByDates={eventsByDates}
                    currentUser={currentUser}
                />
            </ScrollView>
        }
        {calendarModeModel === CalendarModeModel.DAY &&
            <ScrollView style={{height: "100%", width: "100%"}}>
                <CalendarDay
                    dateMode={calendarModeModel}
                    currentDay={currentDay}
                    isSelectedDay={isSelectedDay}
                    changeCurrentDay={changeCurrentDay}
                    eventsByDates={eventsByDates}
                    currentUser={currentUser}
                />
            </ScrollView>
        }


        <Modal
            style={{
                display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", height: "100%"
            }}
            animationType="fade"
            transparent={true}
            visible={openBookedModal}
            onRequestClose={() => dispatch(setSelectedEvent(undefined))}
        >
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'

            }}>
                <View style={{
                    width: "90%",
                    height: "90%",
                    padding: 20,
                    backgroundColor: colors.white,
                    borderRadius: 8,
                    display: "flex",
                    gap: 10
                }}>
                    <TouchableOpacity
                        onPress={() => dispatch(setSelectedEvent(undefined))}>
                        <Image
                            style={{height: 20, width: 20}}
                            source={require("../../../../assets/icons/close.png")}/></TouchableOpacity>
                    <View style={styles.eventDetailsContainer}>
                        <Text>{selectedEvent?.description}</Text>
                    </View>
                    <View style={styles.eventDetailsLine}>
                        <Text style={styles.eventDetailsValue}>{selectedEvent?.location}</Text>
                        <Text style={styles.eventDetailsLabel}>{text.location}:</Text>
                    </View>
                    <View style={styles.eventDetailsLine}>
                        <Text
                            style={styles.eventDetailsValue}>{moment(selectedEvent?.start).format("HH:MM DD/MM")}</Text>
                        <Text style={styles.eventDetailsLabel}>{text.startAtTime}:</Text>
                    </View>
                    <View style={styles.eventDetailsLine}>
                        <Text
                            style={styles.eventDetailsValue}>{moment(selectedEvent?.end).format("HH:MM DD/MM")}</Text>
                        <Text style={styles.eventDetailsLabel}>{text.endAtTime}:</Text>
                    </View>
                    {getStatusEventForClient((selectedEvent as EventModel)?.users ?? [], currentUser) !== UserEventStatus.booked &&
                        <View style={styles.eventDetailsLine}>
                            <Text
                                style={styles.eventDetailsValue}>{selectedAvailabilityEvent === UserEventStatus.available ? "זמין" : "לא זמין"}</Text>
                            <Text style={styles.eventDetailsLabel}>{text.availabilityStatus}:</Text>
                        </View>}
                    {getStatusEventForClient((selectedEvent as EventModel)?.users ?? [], currentUser) !== UserEventStatus.booked &&
                        <View style={{display: "flex", gap: 30}}>
                            <Text style={styles.eventDetailsLabel}>{text.setAvailabilityText}:</Text>
                            <View style={{display: "flex", flexDirection: "row", justifyContent: "center", gap: 20}}>
                                <TouchableOpacity
                                    style={{
                                        borderRadius: 50,
                                        padding: 6,
                                        backgroundColor: selectedAvailabilityEvent === UserEventStatus.available ? "green" : "white"
                                    }}
                                    onPress={addAvailabilityEvent}>
                                    <Image style={{width: 30, height: 30}}
                                           source={require("../../../../assets/icons/correct.png")}/>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    borderRadius: 50,
                                    padding: 6,
                                    backgroundColor: selectedAvailabilityEvent === UserEventStatus.nothing ? "red" : "white"
                                }} onPress={removeAvailabilityEvent}>
                                    <Image style={{width: 30, height: 30}}
                                           source={require("../../../../assets/icons/wrong.png")}/>
                                </TouchableOpacity>
                            </View>
                        </View>}
                    {getStatusEventForClient((selectedEvent as EventModel)?.users ?? [], currentUser) === UserEventStatus.booked &&
                        <View><Text>{text.youAreAlreadyBooked}</Text></View>
                    }

                    <TouchableOpacity
                        style={{width: "100%", marginTop: 40, display: "flex", alignItems: "center"}}
                        onPress={() => dispatch(setSelectedEvent(undefined))}>
                        <Text style={{color: colors.primary}}>סיימתי</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
}
import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {text} from "../../../../utils/dictionary-management";
import {colors} from "../../../../utils/colors";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";
import {useAppSelector} from "../../../../app/hooks";
import {setDateCalendarTypeAvailable} from "../../../../store/global.slice";
import {useDispatch} from "react-redux";
import {SelectedPage} from "../../../../utils/enum.const";


export const TemplateHeader: React.FC<{ selectedPage: SelectedPage }> = ({selectedPage}) => {
    const getTitleByPage = () => {
        switch (selectedPage) {
            case SelectedPage.MyAvailabilityPage:
                return text.myAvailability;
            case SelectedPage.MyShiftPage:
                return text.myShift
            default:
                return "unknow page"
        }
    }
    const dispatch = useDispatch()
    const {dateCalendarTypeAvailable} = useAppSelector(state => state.global)
    const styles = StyleSheet.create({
        headerContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.dark
        }, title: {
            fontSize: 20,
            fontWeight: "600"
        },
        buttonsWrapper: {
            display: "flex", marginBottom: 10, marginTop: 10, flexDirection: "row", gap: 30
        }, btnStyle: {
            padding: 6,
            borderWidth: 1,
            borderColor: colors.wolf,
            borderRadius: 4
        }
    });
    return <View style={styles.headerContainer}>
        <Text style={styles.title}>{getTitleByPage()}</Text>
        <View style={styles.buttonsWrapper}>
            <TouchableOpacity
                onPress={() => dispatch(setDateCalendarTypeAvailable(CalendarModeModel.WEEK))}
                style={[styles.btnStyle, {backgroundColor: dateCalendarTypeAvailable === CalendarModeModel.WEEK ? colors.primary : colors.white}]}>
                <Text style={{
                    fontSize: 14,
                    color: dateCalendarTypeAvailable === CalendarModeModel.WEEK ? colors.white : colors.dark
                }}>{text.thisWeek}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => dispatch(setDateCalendarTypeAvailable(CalendarModeModel.MONTH))}
                style={[styles.btnStyle, {backgroundColor: dateCalendarTypeAvailable === CalendarModeModel.MONTH ? colors.primary : colors.white}]}>
                <Text style={{
                    fontSize: 14,
                    color: dateCalendarTypeAvailable === CalendarModeModel.MONTH ? colors.white : colors.dark
                }}>{text.thisMonth}</Text>
            </TouchableOpacity>
        </View>
    </View>
}
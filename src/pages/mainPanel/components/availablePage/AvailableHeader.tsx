import React, {useState} from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {text} from "../../../../utils/dictionary-management";
import {colors} from "../../../../utils/colors";
import {CalendarModeModel} from "../../../../models/calendar-mode.model";


export const AvailableHeader: React.FC<{ dateType: CalendarModeModel, setDateType: any }> = ({
                                                                                                 dateType,
                                                                                                 setDateType
                                                                                             }) => {

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
        <Text style={styles.title}>{text.myAvailability}</Text>
        <View style={styles.buttonsWrapper}>
            <TouchableOpacity
                onPress={() => setDateType(CalendarModeModel.WEEK)}
                style={[styles.btnStyle, {backgroundColor: dateType === CalendarModeModel.WEEK ? colors.primary : colors.white}]}>
                <Text style={{
                    fontSize: 14,
                    color: dateType === CalendarModeModel.WEEK ? colors.white : colors.dark
                }}>{text.thisWeek}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setDateType(CalendarModeModel.MONTH)}
                style={[styles.btnStyle, {backgroundColor: dateType === CalendarModeModel.MONTH ? colors.primary : colors.white}]}>
                <Text style={{
                    fontSize: 14,
                    color: dateType === CalendarModeModel.MONTH ? colors.white : colors.dark
                }}>{text.thisMonth}</Text>
            </TouchableOpacity>
        </View>

    </View>


}
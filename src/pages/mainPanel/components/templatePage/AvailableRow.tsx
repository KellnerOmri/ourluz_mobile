import React, {useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {EventModel} from "../../../../models/event.model";

import {removeAvailabilityFromEvent, setAvailabilityToEvent} from "../../../../utils/data-management";
import {text} from "../../../../utils/dictionary-management";
import moment from "moment";
import {colors} from "../../../../utils/colors";
import 'moment/locale/he';

export const AvailableRow: React.FC<{ eventDetails: EventModel, isAvailable: boolean }> = ({
                                                                                               eventDetails,
                                                                                               isAvailable
                                                                                           }) => {


    const [openDropDown, setOpenDropDown] = useState(false)

    const [selectedAvailabilityEvent, setSelectedAvailabilityEvent] = useState(isAvailable)
    console.log(eventDetails, "eventDetails4")
    const addAvailabilityEvent = async () => {
        await setAvailabilityToEvent(eventDetails.id).then()
        setSelectedAvailabilityEvent(true)
    }
    const removeAvailabilityEvent = async () => {
        await removeAvailabilityFromEvent(eventDetails.id).then()
        setSelectedAvailabilityEvent(false)
    }

    const styles = StyleSheet.create({
        wrapperContainer: {
            borderColor: colors.wolf,
            borderBottomWidth: 1,
            padding: 4
        },
        rowContainer: {
            paddingHorizontal: 10,
            paddingVertical: 4,
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
        }, imageWrapper: {
            display: "flex",
            flexDirection: "row",
            gap: 10,
        }, moreDetails: {
            paddingHorizontal: 10,
            display: "flex",
            justifyContent: "center",
        }, boldStyle: {
            fontWeight: "700",
        }, labelWrapper: {
            display: "flex",
            flexDirection: "row",
        }
    });

    return <View style={styles.wrapperContainer}>
        <View style={styles.rowContainer}>
            <View style={styles.imageWrapper}>
                <TouchableOpacity
                    style={{
                        borderRadius: 50,
                        padding: 6,
                        backgroundColor: selectedAvailabilityEvent ? "green" : "white"
                    }}
                    onPress={addAvailabilityEvent}
                >
                    <Image style={{width: 30, height: 30}}
                           source={require("../../../../assets/icons/correct.png")}/>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    borderRadius: 50,
                    padding: 6,
                    backgroundColor: !selectedAvailabilityEvent ? "red" : "white"
                }}
                                  onPress={removeAvailabilityEvent}
                >
                    <Image style={{width: 30, height: 30}}
                           source={require("../../../../assets/icons/wrong.png")}/>
                </TouchableOpacity>

            </View>
            <View style={{display: "flex", flexDirection: "row", gap: 20}}>


                <Text>{eventDetails.description}</Text>
                <TouchableOpacity
                    style={{}}
                    onPress={() => setOpenDropDown(!openDropDown)}
                >
                    <Image style={{width: 20, height: 20}}
                           source={openDropDown ? require("../../../../assets/icons/chevron-down.png") : require("../../../../assets/icons/chevron-up.png")}/>
                </TouchableOpacity>
            </View>
        </View>
        {openDropDown && <View style={styles.moreDetails}>
            <Text style={styles.labelWrapper}>
                <Text style={styles.boldStyle}>{text.location} : </Text>
                <Text>{eventDetails.location}</Text>
            </Text>
            <Text style={styles.labelWrapper}>
                <Text style={styles.boldStyle}>{text.startAtTime} </Text>
                <Text>{moment(eventDetails.start).format("dddd DD/MM HH:MM")}</Text>
            </Text>
            <Text style={styles.labelWrapper}>
                <Text style={styles.boldStyle}>{text.endAtTime} </Text>
                <Text>{moment(eventDetails.end).format("dddd DD/MM HH:MM")}</Text>
            </Text>
            {eventDetails.comments && <Text style={styles.labelWrapper}>
                <Text style={styles.boldStyle}>{text.comments} :</Text>
                <Text>{eventDetails.comments}</Text>
            </Text>}
        </View>}
    </View>
}
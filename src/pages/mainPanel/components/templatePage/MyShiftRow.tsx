import {Text, View} from "react-native";
import React from "react";
import {EventModel} from "../../../../models/event.model";
import {text} from "../../../../utils/dictionary-management";
import moment from "moment/moment";
import {colors} from "../../../../utils/colors";
import {getUserById} from "../../../../utils/general";

export const MyShiftRow: React.FC<{ eventDetails: EventModel }> = ({eventDetails}) => {
    return <View style={{
        alignItems: "flex-end",
        padding: 4,
        backgroundColor: eventDetails.backgroundColor,
        borderBottomWidth: 2,
        borderColor: colors.darkGrey,
    }}>
        <Text style={{fontSize: 18, fontWeight: "700"}}>{eventDetails.description}</Text>
        <Text>{text.location} : {eventDetails.location}</Text>
        <Text>{text.startAtTime} {moment(eventDetails.start).format("dddd DD/MM HH:MM")}</Text>
        <Text>{text.endAtTime} {moment(eventDetails.end).format("dddd DD/MM HH:MM")}</Text>
        <View style={{display: "flex", alignItems: "flex-end"}}>
            <Text>{text.team}:</Text>
            {eventDetails.users.filter(u => u.booked).map((us, index) => {
                const userDetails = getUserById(us.id)
                return <Text
                    key={index}> {userDetails?.lastName} {userDetails?.firstName}, {userDetails?.mobile}</Text>
            })}
        </View>
    </View>
}
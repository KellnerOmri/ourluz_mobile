import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {text} from "../../../../utils/dictionary-management";
import {colors} from "../../../../utils/colors";

export const Header = () => {

    const styles = StyleSheet.create({
        container: {
            width: "100%",
            paddingVertical: 4,
            marginTop: "10%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: colors.primary
        }, title: {
            color: colors.white,
            fontSize: 24,
        }, subTitle: {
            fontStyle: "italic",
            color: colors.wolf,
            fontSize: 18
        }
    });

    return <View style={styles.container}>
        <Text style={styles.title}>
            {text.WelcomeText}
        </Text>
        <Text style={styles.subTitle}>
            {text.ManageYourSchedule}
        </Text>
    </View>
}
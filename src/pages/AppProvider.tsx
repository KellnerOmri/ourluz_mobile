import React from "react";
import {StyleSheet, View} from "react-native";
import {useAppSelector} from "../app/hooks";
import {LoginPage} from "./loginPage/LoginPage";
import {MainPanel} from "./mainPanel/MainPanel";

export const AppProvider = () => {
    const {token} = useAppSelector(state => state.authentication)

    return <View style={styles.container}>
        {!token ? <LoginPage/> :
            <MainPanel/>}
    </View>
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flex: 1,
    },
});


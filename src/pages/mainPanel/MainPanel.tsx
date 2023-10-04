import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Header} from "./components/header/Header";
import {colors} from "../../utils/colors";
import {Calendar} from "./components/calendar/Calendar";
import {useAppSelector} from "../../app/hooks";
import {useDispatch} from "react-redux";
import {SelectedPage} from "../../utils/enum.const";
import {setSelectedPage} from "../../store/global.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setToken} from "../../store/authentication.slice";

export const MainPanel = () => {
    const dispatch = useDispatch()
    const {selectedPage} = useAppSelector(state => state.global)
    const styles = StyleSheet.create({
        organizationHeader: {
            height: "3%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: colors.greyHover,
            elevation: 10,
            shadowOffset: {width: 0, height: 2},
        }, organizationText: {
            fontSize: 16,
            fontWeight: "300",
            // fontFamily: "RussoOne-Regular"
        }, buttonsWrapper: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 40,
        }, welcomeSentence: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 4,
            gap: 10
        }, buttonContainer: {
            backgroundColor: colors.primary,
            width: 120,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            paddingHorizontal: 5,
            borderColor: colors.greyHover,
            borderRadius: 8,
            borderStyle: "solid",
            borderWidth: 1
        }, buttonText: {
            fontSize: 16,
            color: colors.white
        }, footer: {
            height: "10%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
            width: "100%"

        }
    });



    const signOut = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            console.log('Item successfully removed from AsyncStorage');
        } catch (error) {
            console.error('Error removing item from AsyncStorage: ', error);
        }
        dispatch(setToken(undefined))
    }

    return <View style={{height: "100%", width: "100%"}}>
        <View style={{height: "12%"}}><Header/></View>
        <View style={styles.organizationHeader}><Text style={styles.organizationText}>4SPORT</Text></View>
        {selectedPage === SelectedPage.MainPanel && <View style={{height: "75%"}}><Calendar/></View>}
        {selectedPage === SelectedPage.MyAvailabilityPage &&
            <View style={{height: "75%"}}><Text>available page</Text></View>}
        {selectedPage === SelectedPage.MyShiftPage && <View style={{height: "75%"}}><Text>shift page</Text></View>}
        <View style={styles.footer}>
            <TouchableOpacity
                onPress={() => dispatch(setSelectedPage(SelectedPage.MyAvailabilityPage))}
            >
                <View style={{
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    backgroundColor: selectedPage === SelectedPage.MyAvailabilityPage ? colors.primary : colors.white,
                    borderRadius: 50,

                }}>
                    <Image style={{width: 30, height: 30}}
                           source={require("../../assets/icons/checkboxList.png")}/>
                </View>

            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => dispatch(setSelectedPage(SelectedPage.MainPanel))}
            >
                <View style={{
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    backgroundColor: colors.primary,
                    borderRadius: 50,
                    opacity: selectedPage === SelectedPage.MainPanel ? 1 : 0.2
                }}>
                    <Image style={{width: 30, height: 40}}
                           source={require("../../assets/icons/ourluzIcon.png")}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => dispatch(setSelectedPage(SelectedPage.MyShiftPage))}
            >
                <View style={{
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    backgroundColor: selectedPage === SelectedPage.MyShiftPage ? colors.primary : colors.white,
                    borderRadius: 50,

                }}>
                    <Image style={{width: 30, height: 30}}
                           source={require("../../assets/icons/myShift.png")}/>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => signOut()}
            >
                <View style={{
                    borderWidth: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    backgroundColor: colors.white,
                    borderRadius: 50,

                }}>
                    <Image style={{width: 30, height: 30}}
                           source={require("../../assets/icons/signOut.png")}/>
                </View>
            </TouchableOpacity>
        </View>
    </View>
}
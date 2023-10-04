import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import {colors} from "../../utils/colors";
import {useDispatch} from "react-redux";
import {text} from "../../utils/dictionary-management";
import {changePassword} from "../../utils/data-management";
import {setToken} from "../../store/authentication.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CreateNewPassword: React.FC<{ localToken: undefined | string, setForgetPassword: any, setPassword: any, setPhoneNumber: any }> = ({
                                                                                                                                                   localToken,
                                                                                                                                                   setForgetPassword,
                                                                                                                                                   setPassword,
                                                                                                                                                   setPhoneNumber
                                                                                                                                               }) => {

    const styles = StyleSheet.create({
        container: {
            display: "flex",
            gap: 10,
            width: "90%",
            // height: "60%",
            paddingVertical: 10
        },
        textInput: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.white,
            borderWidth: 0.5,
            width: "100%",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5
        }, submitStyle: {
            backgroundColor: colors.primary,
            borderWidth: 0.5,
            borderRadius: 8,
            borderColor: colors.dark,
            paddingVertical: 5,
            alignItems: "center",
        }
    });
    const dispatch = useDispatch()


    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [errorMassage, setErrorMassage] = useState("")
    const handleSubmit = async () => {
        // event.preventDefault();

        if (newPassword === repeatPassword && localToken && localToken !== "") {
            if (newPassword.length < 8 || newPassword.length > 16) {
                setErrorMassage("הסיסמא צריכה להכיל בין 8-16 תווים")
            } else {
                await changePassword(localToken, newPassword).then((r: any) => {
                    if (r && r.response && r?.response?.data?.error) {
                        setErrorMassage(r.response.data.error)
                        console.log(r?.response, "r?.response?")
                    } else {
                        if (r?.data?.authToken) {
                            dispatch(setToken(r?.data?.authToken))
                            AsyncStorage.setItem('userToken', r?.data?.authToken);
                        }
                        setForgetPassword(false)
                        setPassword("")
                    }
                }).then((res) => {
                })
            }
        } else {
            setErrorMassage("סיסמא לא תואמת")
        }
    };

    return <View style={styles.container}>
        <TouchableOpacity onPress={() => setPhoneNumber("")}>
            <Image style={{width: 20, height: 20, marginBottom: 20}} source={require("../../assets/icons/close.png")}/>
        </TouchableOpacity>
        <View style={styles.textInput}><TextInput secureTextEntry={true}
                                                  style={{width: newPassword.length ? "90%" : "100%"}}
                                                  placeholder={"new password"} value={newPassword}
                                                  onChangeText={(text) => {
                                                      setErrorMassage("")
                                                      setNewPassword(text)
                                                  }}></TextInput>
            {newPassword.length > 0 &&
                <TouchableOpacity style={{width: "10%"}} onPress={() => setNewPassword("")}><Image
                    style={{width: 15, height: 20}}
                    source={require("../../assets/icons/close.png")}/></TouchableOpacity>}
        </View>
        <View style={styles.textInput}>
            <TextInput secureTextEntry={true} style={{width: repeatPassword.length > 0 ? "90%" : "100%"}}
                       placeholder={"verify password"} value={repeatPassword}
                       onChangeText={(text) => {
                           setErrorMassage("")
                           setRepeatPassword(text)
                       }}></TextInput>
            {repeatPassword.length > 0 &&
                <TouchableOpacity style={{width: "10%"}} onPress={() => setRepeatPassword("")}>
                    <Image style={{width: 15, height: 20}}
                           source={require("../../assets/icons/close.png")}/>
                </TouchableOpacity>}
        </View>
        <View>
            <Text style={{color: colors.alert, textAlign: "center"}}>{errorMassage}</Text>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitStyle}><Text
            style={{fontWeight: "600", color: colors.white}}>צור סיסמא
            חדשה</Text>
        </TouchableOpacity>
    </View>
}
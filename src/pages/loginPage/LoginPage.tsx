import React, {useEffect, useState} from "react";
import {Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {colors} from "../../utils/colors";
import packageJson from '../../../package.json';
import {mainPath} from "../../utils/variable.const";
import axios from "axios";
import {setToken} from "../../store/authentication.slice";
import {useDispatch} from "react-redux";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {forgetPasswordSendVerifyCode} from "../../utils/data-management";
import PinInput from "./PinInput";

export const LoginPage = () => {
    const dispatch = useDispatch()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorSubmit, setErrorSubmit] = useState(false)
    const [forgetPassword, setForgetPassword] = useState(false);
    const [usernameDoesntWrote, setUsernameDoesntWrote] = useState(false);

    const saveTokenToStorage = async (token: string) => {
        try {
            await AsyncStorage.setItem('userToken', token);
            console.log('Token saved successfully!');
        } catch (error) {
            console.error('Error saving token: ', error);
        }
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colors.primary,
            height: "100%",
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
            alignItems: "center"
        },
        mainLogIn: {
            flex: 1,
            marginTop: "20%",
            backgroundColor: colors.primary,
            display: "flex",
            width: "100%",
            alignItems: "center"
        },
        logo: {
            width: 150, height: 150
        },
        textInput: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.white,
            width: "100%",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5
        },
        inputWrapper: {
            marginTop: 40, width: "50%", display: "flex", gap: 10
        },
        forgetPassword: {
            marginTop: 20
        },
        forgetPassText: {color: colors.white, fontWeight: "600"},
        version: {marginTop: 100, height: 50},
        versionText: {
            fontWeight: "600", fontSize: 12
        },
        submitButton: {
            marginTop: 10, padding: 8, borderRadius: 8, width: "50%", backgroundColor: colors.lightBlue
        },
        submitText: {
            textAlign: "center", color: colors.white, fontWeight: "600"
        }, logoWrapper: {
            marginTop: 10
        }
    });
    const checkIfUserConnected = async (token: string) => {
        dispatch(setToken(token))
    }
    const getUserFromStorage = async () => {
        try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken !== null) {
                // User token is retrieved successfully
                await checkIfUserConnected(userToken);
            } else {
                // User token does not exist in AsyncStorage
                console.log('User token does not exist.');
                return null;
            }
        } catch (error) {
            // Error retrieving data
            console.error('Error retrieving user token:', error);
            return null;
        }
    };

// Usage


    useEffect(() => {
        getUserFromStorage().then();
    }, [])
    const handleSubmit = async () => {
        if (username.length === 0 || password.length === 0) {
            setErrorSubmit(true)
            return false
        }
        // e.preventDefault();
        try {

            const response = await axios.post(`${mainPath}api-token-auth/`,

                {
                    username, password,
                },);
            if (response?.data?.token) {
                await dispatch(setToken(response.data.token))
                await saveTokenToStorage(response.data.token)
                // localStorage.setItem("token", response.data.token);
                // cameFromWeeklyBooked && closeLoginPage()
            } else {
                setErrorSubmit(true)
                return false
            }
        } catch (error) {
            setErrorSubmit(true)
            console.error(error);
        }
    };


    const [phoneNumber, setPhoneNumber] = useState("")
    const pressForgetPassword = async () => {

        await forgetPasswordSendVerifyCode(username).then((res) => {
            if (!res) {
                setForgetPassword(true)
                setPhoneNumber("")
                setUsername("")
            }
            if (res && res.data.mobile) {
                setPhoneNumber(res.data.mobile)
            }
        })
    }


    return <View style={styles.container}>
        <View style={styles.mainLogIn}>


            <View style={styles.inputWrapper}>
                <View style={styles.textInput}><TextInput style={{width: "80%"}} placeholder={"Username"}
                                                          value={username}
                                                          onChangeText={setUsername}></TextInput>
                    {username.length > 0 && <TouchableOpacity style={{width: 20}} onPress={() => setUsername("")}><Image
                        style={{width: 15, height: 15}}
                        source={require("../../assets/icons/close.png")}/></TouchableOpacity>}
                </View>
                <View style={styles.textInput}><TextInput secureTextEntry={true} style={{width: "80%"}}
                                                          placeholder={"Password"} value={password}
                                                          onChangeText={setPassword}></TextInput>
                    {password.length > 0 &&
                        <TouchableOpacity onPress={() => setPassword("")}><Image style={{width: 15, height: 15}}
                                                                                 source={require("../../assets/icons/close.png")}/></TouchableOpacity>}
                </View>
            </View>

            <TouchableOpacity onPress={() => handleSubmit()} style={styles.submitButton}><Text
                style={styles.submitText}>התחבר</Text></TouchableOpacity>
            <TouchableOpacity onPress={async () => {
                username.length > 0 ? await pressForgetPassword() : setUsernameDoesntWrote(true)
            }} style={styles.forgetPassword}><Text
                style={styles.forgetPassText}>שככחתי את
                הסיסמא</Text></TouchableOpacity>
            <View style={styles.logoWrapper}>
                <Image style={styles.logo} source={require("../../assets/images/ourLuzLogo.png")}/>
            </View>
        </View>
        <View style={styles.version}><Text style={styles.versionText}>Version {packageJson.version}</Text></View>
        {/*error submit modal*/}
        <Modal
            style={{
                display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", height: "100%"
            }}
            animationType="fade"
            transparent={true}
            visible={errorSubmit}
            onRequestClose={() => setErrorSubmit(false)}
        >
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'

            }}>
                <View style={{
                    width: "50%",
                    paddingVertical: 20, // height: "10%",
                    backgroundColor: colors.wolf,
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Text>הפרטים שהזנת שגויים</Text>
                    <TouchableOpacity
                        style={{width: "100%", display: "flex", alignItems: "center"}}
                        onPress={() => setErrorSubmit(false)}>
                        <Text style={{color: colors.primary}}>הבנתי</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        {/*click forget password with incorrect username*/}
        <Modal
            style={{
                display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", height: "100%"
            }}
            animationType="fade"
            transparent={true}
            visible={forgetPassword}
            onRequestClose={() => setForgetPassword(false)}
        >
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'

            }}>
                <View style={{
                    width: "50%",
                    paddingVertical: 20, // height: "10%",
                    backgroundColor: colors.wolf,
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Text>שם משתמש שהוזן אינו תקין</Text>
                    <TouchableOpacity
                        style={{width: "100%", display: "flex", alignItems: "center"}}
                        onPress={() => setForgetPassword(false)}>
                        <Text style={{color: colors.primary}}>הבנתי</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        {/*click forget password without username*/}

        <Modal
            style={{
                display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", height: "100%"
            }}
            animationType="fade"
            transparent={true}
            visible={usernameDoesntWrote}
            onRequestClose={() => setUsernameDoesntWrote(false)}
        >
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'

            }}>
                <View style={{
                    width: "50%",
                    paddingVertical: 20, // height: "10%",
                    backgroundColor: colors.wolf,
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10
                }}>
                    <Text>יש להזין שם משתמש</Text>
                    <TouchableOpacity
                        style={{width: "100%", display: "flex", alignItems: "center"}}
                        onPress={() => setUsernameDoesntWrote(false)}>
                        <Text style={{color: colors.primary}}>הבנתי</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

        {/*user is correct*/}
        <Modal
            style={{
                display: "flex", justifyContent: "center", flexDirection: "row", alignItems: "center", height: "100%"
            }}
            animationType="fade"
            transparent={true}
            visible={phoneNumber.length > 0}
            onRequestClose={() => setPhoneNumber("")}
        >
            <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'

            }}>
                <View style={{
                    width: "70%",
                    paddingVertical: 20,
                    backgroundColor: colors.wolf,
                    borderRadius: 8,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10
                }}>
                    <PinInput userName={username}
                              setForgetPassword={setForgetPassword}
                              setPassword={setPassword}
                              phoneNumber={phoneNumber}
                              setPhoneNumber={setPhoneNumber}/>
                </View>
            </View>
        </Modal>
    </View>
}
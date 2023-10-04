import React, {useRef, useState} from 'react';
import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {checkVerifyCode} from "../../utils/data-management";
import {colors} from "../../utils/colors";
import {CreateNewPassword} from "./CreateNewPassword";

export const PinInput: React.FC<{ userName: string, setForgetPassword: any, setPassword: any, phoneNumber: string, setPhoneNumber: any }> = ({
                                                                                                                                                 userName,
                                                                                                                                                 setForgetPassword,
                                                                                                                                                 setPassword,
                                                                                                                                                 phoneNumber,
                                                                                                                                                 setPhoneNumber
                                                                                                                                             }) => {


    const styles = StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 20
        },
        input: {
            width: 50,
            height: 50,
            borderWidth: 1,
            textAlign: 'center',
            fontSize: 20,
            marginHorizontal: 5,
            borderColor: colors.primary,
            borderRadius: 4
        },
        submitStyle: {
            marginTop: 10,
            color: colors.primary,
            fontSize: 16,
            fontWeight: "600"
        },
        buttonWrapper: {
            justifyContent: "center",
            display: "flex",
            alignItems: "center",
            padding: 2,
            width: 30,
            flexDirection: "row"
        }
    });
    const [invalidCode, setInvalidCode] = useState(false)
    const [localToken, setLocalToken] = useState<undefined | string>(undefined)
    const [createNewPassWord, setCreateNewPassword] = useState(false)


    const validatePin = async () => {
        await checkVerifyCode(pin, userName).then((res) => {
            if (res && res?.data?.token) {
                setInvalidCode(false)
                setLocalToken(res?.data?.token ?? "")
                setCreateNewPassword(true)
                // setPhoneNumber("")
            } else {
                setInvalidCode(true)
            }
        })
    }
    const phoneNumberMask = (phoneNumber: string) => {
        const lastFourDigits = phoneNumber.slice(-3);
        const maskedDigits = phoneNumber.slice(0, phoneNumber.length - 3).replace(/\d/g, '*');
        return `${maskedDigits}${lastFourDigits}`;
    };
    const [pin, setPin] = useState<string>('');
    const pinInputRefs = useRef<TextInput[]>([]);

    const handlePinChange = (text: string, index: number) => {
        if (text.length <= 1) {
            setPin((prevPin) => {
                const newPin = prevPin.split('');
                newPin[index] = text;
                return newPin.join('');
            });

            if (text.length === 1 && index < 3) {
                pinInputRefs.current[index + 1].focus();
            }
        }
    };
    return <View>
        {createNewPassWord ?
            <CreateNewPassword localToken={localToken} setForgetPassword={setForgetPassword}
                               setPassword={setPassword} setPhoneNumber={setPhoneNumber}/> :
            <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <View style={{display: "flex", flexDirection: "row", width: "100%"}}>

                    <TouchableOpacity onPress={() => setPhoneNumber("")} style={styles.buttonWrapper}>
                        <Image style={{width: 20, height: 20}} source={require("../../assets/icons/close.png")}/>
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize: 18, marginBottom: 10}}>{`${userName} שלום `}</Text>

                {phoneNumber.length > 0 ? <View>
                        <Text style={{
                            fontSize: 14,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center"
                        }}>שלחנו אליך קוד אימות למספר</Text>
                        <Text style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                            flexDirection: "row",
                        }}>{phoneNumberMask(phoneNumber)}</Text></View> :
                    <View style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Text>מאמת שם משתמש, אנא
                            המתן...</Text>
                        <Text>מיד תקבל הודעת sms לנייד</Text>
                    </View>}

                <View style={styles.inputContainer}>
                    {[...Array(4)].map((_, index) => (
                        <TextInput
                            key={index}
                            style={styles.input}
                            maxLength={1}
                            keyboardType="numeric"
                            ref={(ref) => (pinInputRefs.current[index] = ref!)}
                            onChangeText={(text) => handlePinChange(text, index)}
                            value={pin[index] || ''}
                        />
                    ))}
                </View>
                {invalidCode && <Text style={{padding: 10, color: colors.alert}}>הזנת קוד שגוי,אנא נסה שנית</Text>}
                <TouchableOpacity onPress={validatePin}>
                    <Text style={styles.submitStyle}>אישור</Text>
                </TouchableOpacity>
            </View>
        }
    </View>
};

export default PinInput;

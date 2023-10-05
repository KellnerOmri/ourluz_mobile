import axios from "axios";
import {store} from "../app/store";
import {
    setCurrentUser,
    setEventList,
    setIsAdmin,
    setRollList,
    setUserList,
    setWeeklyEventList
} from "../store/global.slice";
import {mainPath} from "./variable.const";
import {EventModel} from "../models/event.model";
import {CapacityModel} from "../models/capacity.model";
import {RollModel} from "../models/roll.model";
import {UserModel} from "../models/user.model";
import moment from "moment";

const getToken = () => {
    return store.getState().authentication.token
}
const getAllUsersRedux = () => {
    return store.getState().global.userList
}


export const deleteUser = async (userId: number) => {
    const allUsers = getAllUsersRedux()
    try {
        await axios.delete(`${mainPath}yoman/users/${userId}`, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
        const newUsersList: UserModel[] = []
        allUsers.forEach((u) => {
            if (u.id !== userId) {
                newUsersList.push(u);
            }
        })
        store.dispatch(setUserList(newUsersList))
    } catch (e) {
        console.log(e, "error")
    }
}

export const updateUserById = async (userDetails: {
    username: string, firstName: string, lastName: string, email: string, mobile: string, roleIds: number[], id: number, permanentEmployee?: number, subscribeToReminderMessage?: number
}) => {
    const allUsers = getAllUsersRedux()
    try {
        const response = await axios.put(`${mainPath}yoman/users/${userDetails.id}`, {
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            mobile: userDetails.mobile,
            roleIds: userDetails.roleIds,
            permanentEmployee: userDetails.permanentEmployee,
            subscribeToReminderMessage: userDetails.subscribeToReminderMessage,
            username: userDetails.username
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });

        const newUserList = allUsers.map((u, index) => {
            if (u.id === userDetails.id) {
                return {
                    ...u,
                    username: userDetails.username,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    mobile: userDetails.mobile,
                    roleIds: userDetails.roleIds,
                    permanentEmployee: userDetails.permanentEmployee,
                    subscribeToReminderMessage: userDetails.subscribeToReminderMessage
                }
            } else {
                return u
            }
        })
        store.dispatch(setUserList(newUserList))
    } catch (e) {
        console.log(e, "error")
    }
}

export const createNewUser = async (newUserDetails: {
    username: string, password: string, firstName: string, lastName: string, email: string, mobile: string, roleIds: number[]
}) => {
    try {
        const response = await axios.post(`${mainPath}yoman/users/`, {
            username: newUserDetails.username,
            password: newUserDetails.password,
            firstName: newUserDetails.firstName,
            lastName: newUserDetails.lastName,
            email: newUserDetails.email,
            mobile: newUserDetails.mobile,
            roleIds: newUserDetails.roleIds,
            permanentEmployee: 0,
            subscribeToReminderMessage: 0
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
        const newUser: UserModel = response.data.user;
        const allUsers: UserModel[] = getAllUsersRedux()
        if (newUser) {
            const newUserList: UserModel[] = [...allUsers, newUser];
            store.dispatch(setUserList(newUserList))
        }

    } catch (e) {
        return e
        console.log(e, "error")
    }
}


export const getAllUsers = async () => {
    axios.get(`${mainPath}yoman/users/`, {
        headers: {
            Authorization: `TOKEN ${getToken()}`
        }
    })
        .then(response => {
            const data = response.data.users;
            store.dispatch(setUserList(data))
        })
        .catch(error => {
            console.error(error);
        });
};

export const getAllEventsByDates = async (startDate: string = "2023-06-03", endDate: string = "2030-06-29") => {
    axios.get(`${mainPath}yoman/events?fromDate=${startDate}&toDate=${endDate}`, {
        headers: {
            Authorization: `TOKEN ${getToken()}`
        }
    })
        .then(response => {
            const data = response.data.events;
            let getEventList: { [key: string]: EventModel } = {}
            data.forEach((eventObj: any) => {
                getEventList[eventObj.id] = {
                    id: eventObj.id,
                    description: eventObj.description,
                    start: eventObj.startDate,
                    end: eventObj.endDate,
                    location: eventObj.location,
                    comments: eventObj.comments,
                    backgroundColor: `${eventObj.backgroundColor}`,
                    allDay: true,
                    organizationId: eventObj.organizationId,
                    capacity: eventObj.capacity,
                    users: eventObj.users
                }
            })
            store.dispatch(setWeeklyEventList(getEventList))
            return getEventList
        })
        .catch(error => {
            console.error(error);
        });
};


export const getAllEventsByOrganization = async (startDate: string = "2023-06-03", endDate: string = "2030-06-29") => {
    axios.get(`${mainPath}yoman/events?fromDate=${startDate}&toDate=${endDate}`, {
        headers: {
            Authorization: `TOKEN ${getToken()}`
        }
    })
        .then(response => {
            const data = response.data.events;
            let getEventList: { [key: string]: EventModel } = {}
            data.forEach((eventObj: any) => {
                getEventList[eventObj.id] = {
                    id: eventObj.id,
                    description: eventObj.description,
                    start: eventObj.startDate,
                    end: eventObj.endDate,
                    location: eventObj.location,
                    comments: eventObj.comments,
                    backgroundColor: `${eventObj.backgroundColor}`,
                    allDay: true,
                    organizationId: eventObj.organizationId,
                    capacity: eventObj.capacity,
                    users: eventObj.users
                }
            })
            store.dispatch(setEventList(getEventList))
        })
        .catch(error => {
            console.error(error);
        });
};

export const updateEventById = async (eventId: number, newList: any, eventData: {
    description: string, startDate: Date, endDate: Date, backgroundColor: string, location: string, comments: string, capacity: CapacityModel[]
}) => {
    try {
        await axios.put(`${mainPath}yoman/events/${eventId}`, {
            description: eventData.description,
            startDate: moment(eventData.startDate).format("yyyy-MM-DDTHH:mm:ss"),
            endDate: moment(eventData.endDate).format("yyyy-MM-DDTHH:mm:ss"),
            backgroundColor: eventData.backgroundColor,
            location: eventData.location,
            comments: eventData.comments,
            capacity: eventData.capacity
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });

        newList[eventId] = {
            ...newList[eventId],
            description: eventData.description,
            startDate: moment(eventData.startDate).format("yyyy-MM-DDTHH:mm:ss"),
            endDate: moment(eventData.endDate).format("yyyy-MM-DDTHH:mm:ss"),
            backgroundColor: eventData.backgroundColor,
            location: eventData.location,
            comments: eventData.comments,
            capacity: eventData.capacity
        }
        return newList
    } catch (e) {
        console.log(e, "error")
    }
}

export const createNewEvent = async (newList: any, eventData: {
    description: string, startDate: Date, endDate: Date, backgroundColor: string, location: string, comments: string, capacity: CapacityModel[]
}) => {
    try {
        const response = await axios.post(`${mainPath}yoman/events`, {
            description: eventData.description,
            startDate: moment(eventData.startDate).format("yyyy-MM-DDTHH:mm:ss"),
            endDate: moment(eventData.endDate).format("yyyy-MM-DDTHH:mm:ss"),
            backgroundColor: eventData.backgroundColor,
            location: eventData.location,
            comments: eventData.comments,
            capacity: eventData.capacity
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
        newList[response.data.id] = {...response.data, start: response.data.startDate, end: response.data.endDate}
        return newList;
    } catch (e) {
        return e;
        console.log(e, "error")
    }
}


export const deleteEvent = async (newList: any, eventId: number) => {
    try {
        await axios.delete(`${mainPath}yoman/events/${eventId}`, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
        delete newList[eventId]
        store.dispatch(setEventList(newList))
    } catch (e) {
        console.log(e, "error")
    }
}


export const getAllRolesByOrganization = async () => {
    axios.get(`${mainPath}yoman/roles`, {
        headers: {
            Authorization: `TOKEN ${getToken()}`
        }
    })
        .then(response => {
            const data = response.data.roles;
            let rollList: RollModel[] = data
            store.dispatch(setRollList(rollList))
        })
        .catch(error => {
            console.error(error);
        });
};

export const isUserIsManager = async (token?: string) => {
    try {
        await axios.get(`${mainPath}yoman/users/currentUser`, {
            headers: {
                Authorization: `TOKEN ${token ?? getToken()}`
            }
        })
            .then(response => {
                const isAdmin = response.data?.isAdmin ?? false;
                const currentUser: UserModel | undefined = response.data ?? undefined;
                store.dispatch(setIsAdmin(isAdmin))
                store.dispatch(setCurrentUser(currentUser))
            })
        return true
    } catch (e) {
        console.log(e, "error35")
        return false
    }
};


export const editBookedUserRoll = async (eventId: number, userId: number, roleId: number) => {
    try {
        const response = await axios.post(`${mainPath}yoman/bocks/`, {
            eventId: eventId,
            userId: userId,
            roleId: roleId,
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        }).then((res) => {
            return res
        });
        return response
    } catch (e) {
        console.log(e, "error3")
        return e
    }
}
export const unBookedUser = async (eventId: number, userId: number) => {
    try {
        await axios.patch(`${mainPath}yoman/bocks/`, {
            eventId: eventId,
            userId: userId,
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
    } catch (e) {
        console.log(e, "error")
    }
}


export const setAvailabilityToEvent = async (eventId: number) => {
    try {
        await axios.post(`${mainPath}yoman/users/currentUser`, {
            eventId: eventId
        }, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
    } catch (e) {
        console.log(e, "error3")
    }
}

export const removeAvailabilityFromEvent = async (eventId: number) => {
    try {
        await axios.delete(`${mainPath}yoman/users/currentUser`, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            },
            data: {
                eventId: eventId
            }
        });
    } catch (e) {
        console.log(e, "error3")
    }
}


export const sendLinkAsSms = async (fromDate: string) => {
    try {

        await axios.post(`${mainPath}yoman/publish/?fromDate=${fromDate}`, {}, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
    } catch (e) {
        console.log(e, "error3")
    }
}


export const forgetPasswordSendVerifyCode = async (userName: string) => {
    try {
        const response = await axios.post(`${mainPath}yoman/users/${userName}/forgotPassword`, {}, {
            headers: {}
        });
        return response
    } catch (e) {
        console.log(e, "error3")
        return false
    }
}

export const checkVerifyCode = async (pinCode: string, userName: string) => {
    try {
        const response = await axios.post(`${mainPath}yoman/users/${userName}/verifyDigits`, {
            "digits": parseInt(pinCode)
        }, {
            headers: {}
        });
        return response;
    } catch (e) {
        console.log(e, "error3")
        return false
    }
}
export const changePassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(`${mainPath}yoman/users/changePassword`, {
            newPassword: newPassword
        }, {
            headers: {
                Authorization: `Berear ${token}`
            }
        });
        return response;
    } catch (e) {
        console.log(e, "error3")
        return e
    }
}


export const sendLinkForNewUser = async (userId: number) => {
    try {
        const response = await axios.post(`${mainPath}yoman/users/${userId?.toString()}/invite`, {}, {
            headers: {
                Authorization: `TOKEN ${getToken()}`
            }
        });
        return response;
    } catch (e) {
        return false
    }
}

export const createEventDictionary = (events: EventModel[]): { [date: string]: EventModel[] } => {
    const eventDictionary: { [date: string]: EventModel[] } = {};

    events.forEach(event => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);

        const currentDate = new Date(startDate);

        // Loop through dates between start and end dates
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];

            if (!eventDictionary[dateString]) {
                eventDictionary[dateString] = [];
            }

            eventDictionary[dateString].push(event);
            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
    });

    return eventDictionary;
}

// Call the function with your events array


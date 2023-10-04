import {store} from "../app/store";
import {EventModel} from "../models/event.model";
import {UserModel} from "../models/user.model";
import {UserEventStatus} from "./enum.const";

const {isEnglish} = store.getState().global

const getRollList = () => {
    return store.getState().global.rollList
}
const getUsersList = () => {
    return store.getState().global.userList
}

export function isMobileFunction(): boolean {
    const toMatch: RegExp[] = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

    if (toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    }) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform))) {
        return true;
    }

    return false;
}

export const getRollName = (rollId: number | null) => {
    return getRollList().find((a) => a.id === rollId)?.description
}

// export const getRollIcon = (rollId: number | null): keyof iconNames => {
//     switch (rollId){
//         case 1:{
//             return "manager"
//         }
//         case 2:{
//             return "computerMan"
//         }
//         case 3:{
//             return "driver"
//         }
//         default :{
//           return "regularEmployee"
//         }
//     }
//     // return getRollList().find((a) => a.id === rollId)?.description
// }
export const getUserById = (userId: number) => {
    return getUsersList().find((u) => u.id === userId)
}
export const isEventHasFullBooking = (event: EventModel | undefined) => {
    let isFullBooked = true
    if (event === undefined) {
        return false
    }
    event.capacity.forEach((c) => {
        if (c.count > event.users.filter((us) => us.booked && c.roleId === us.roleId).length) {
            isFullBooked = false
        }
    })
    return isFullBooked
}

export const checkIfUserIsAvailabilityToEvent = (currentUser: UserModel | undefined, userList: { id: number, booked: boolean, roleId: number | null }[]) => {
    let isAvailable = false
    userList.forEach((u) => {
        if (u.id === currentUser?.id) {
            isAvailable = true
        }
    })
    return isAvailable
}

export const getColorByStatus = (status: UserEventStatus) => {
    switch (status) {
        case UserEventStatus.booked: {
            return "green"
        }
        case UserEventStatus.available: {
            return "orange"
        }
        case UserEventStatus.nothing: {
            return "var(--primary)"
        }
        case UserEventStatus.eventDoneWithoutBooked: {
            return "red"
        }
    }

}


export const getStatusEventForClient = (eventUsers: { id: number, booked: boolean, roleId: number | null }[], currentUser: UserModel | undefined): UserEventStatus => {
    let status: UserEventStatus = UserEventStatus.nothing
    // event.users.

    eventUsers.filter((user) => user.id === currentUser?.id).forEach((u) => {
        if (u.booked) {
            status = UserEventStatus.booked
        } else {
            status = UserEventStatus.available
        }
    })
    return status
}

export const getFirstDayOfWeek = (date: Date): Date => {
    const copiedDate = new Date(date);
    const dayOfWeek = copiedDate.getDay();
    copiedDate.setDate(copiedDate.getDate() - dayOfWeek);
    return copiedDate;
}
export const getLastDateOfWeek = (firstDayOfWeek: Date): Date => {
    const lastDate = new Date(firstDayOfWeek)
    lastDate.setDate(lastDate.getDate() + 6);
    return lastDate;
}
export const convertToTwoDigitsDate = (dayIndex: number): string | number => {
    return dayIndex < 10 ? `0${dayIndex}` : dayIndex
}
import {CapacityModel} from "./capacity.model";

export interface EventModel {
    id:number,
    description: string,
    start: Date,
    end: Date,
    location: string,
    backgroundColor: string,
    allDay: boolean
    organizationId?:number,
    capacity:CapacityModel[],
    comments:string
    users:{"id": number,
        "booked": boolean,
        "roleId": number|null}[]
}
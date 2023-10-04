export interface UserModel {
    id: number,
    organizationId: number,
    email: string
    roleIds: number[]
    firstName: string
    lastName: string,
    mobile:string,
    isAdmin?:boolean
    permanentEmployee?:number
    subscribeToReminderMessage?:number,
    username:string
}

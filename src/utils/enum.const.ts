export enum SelectedPage {
    LoginPage = 1,
    MainPanel = 2,
    EmployeePage = 3,
    MyAvailabilityPage=4,
    MyShiftPage=5,
    SendBookPage

}


export enum SelectedPopup {
    Close = 0,
    EventDetail = 1,
    ShiftManager = 2,
    RollManager = 3,
    EmployeeList = 4,
    ClientEventDetails = 5
}



export enum UserEventStatus {
    booked = 0,
    available = 1,
    nothing = 2,
    eventDoneWithoutBooked
}


export enum EmployeeRoll {
    manager = 1,
    computerMan = 2,
    driver = 3,
    regularEmployee
}



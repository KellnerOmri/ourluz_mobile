import {store} from "./src/app/store";
import {Provider} from "react-redux";
import React from "react";
import {AppProvider} from "./src/pages/AppProvider";


export default function App() {

    return (<Provider store={store}>
            <AppProvider/>
        </Provider>

    );
}

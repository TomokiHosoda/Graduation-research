import * as React from "react";
import { ExpertDesktopDrawer } from "../model/DrawerExpert";
import { Header } from "../model/Header";
import { menuContext } from "../hook/AppState";

export const TopExpert = () => {
    const [isOpened, setOpened] = React.useState(true);

    return (
        <>
            <menuContext.Provider value={{ isOpened, setOpened }}>
                <Header />
                <ExpertDesktopDrawer open={isOpened} />
            </menuContext.Provider>
        </>
    );
};
import * as React from "react";
import { DesktopDrawer } from "../model/DrawerBeginner";
import { Header } from "../model/Header";
import { menuContext } from "../hook/AppState";

export const Top = () => {
    const [isOpened, setOpened] = React.useState(true);

    return (
        <>
            <menuContext.Provider value={{ isOpened, setOpened }}>
                <Header />
                <DesktopDrawer open={isOpened} />
            </menuContext.Provider>
        </>
    );
};

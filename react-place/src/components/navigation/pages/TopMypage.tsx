import * as React from "react";
import { MypageDesktopDrawer } from "../model/DrawerMypage";
import { Header } from "../model/Header";
import { menuContext } from "../hook/AppState";

export const TopMypage = () => {
    const [isOpened, setOpened] = React.useState(true);

    return (
        <>
            <menuContext.Provider value={{ isOpened, setOpened }}>
                <Header />
                <MypageDesktopDrawer open={isOpened} />
            </menuContext.Provider>
        </>
    );
};
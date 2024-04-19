import Drawer from "@mui/material/Drawer";
import * as React from "react";
import SidebarMypage from "../sidebar/SidebarMypage";

type Props = {
    open: boolean;
};

export const MypageDesktopDrawer: React.FC<Props> = (props) => {
    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={props.open}
            >
                <SidebarMypage />
            </Drawer>
        </>
    );
};
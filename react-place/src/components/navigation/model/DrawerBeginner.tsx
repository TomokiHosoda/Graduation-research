import Drawer from "@mui/material/Drawer";
import * as React from "react";
import Sidebar from "../sidebar/SidebarBeginner";

type Props = {
    open: boolean;
};

export const DesktopDrawer: React.FC<Props> = (props) => {
    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={props.open}
            >
                <Sidebar />
            </Drawer>
        </>
    );
};

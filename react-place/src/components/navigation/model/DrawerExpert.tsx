import Drawer from "@mui/material/Drawer";
import * as React from "react";
import SidebarExpert from "../sidebar/SidebarExpert";

type Props = {
    open: boolean;
};

export const ExpertDesktopDrawer: React.FC<Props> = (props) => {
    return (
        <>
            <Drawer
                variant="persistent"
                anchor="left"
                open={props.open}
            >
                <SidebarExpert />
            </Drawer>
        </>
    );
};
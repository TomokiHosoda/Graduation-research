import React from "react";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BackupIcon from "@mui/icons-material/Backup";
import SettingsIcon from "@mui/icons-material/Settings";

export const SidebarBeginnerData = [
  {
    title: "投稿",
    icon: <BackupIcon />,
    link: "/post",
  },
  {
    title: "依頼",
    icon: <AssessmentIcon />,
    link: "/request",
  },
  {
    title: "返信",
    icon: <AttachEmailIcon />,
    link: "/reply",
  },
  {
    title: "詳細設定",
    icon: <SettingsIcon />,
    link: "/rocket",
  },
];
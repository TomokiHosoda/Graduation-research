import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../../FirebaseConfig";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const SidebarIcon: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string>("");

    const storage = getStorage();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUserProfileImage = async () => {
            if (user) {
                const imageRef = ref(storage, `user-icons/${user.uid}`);
                try {
                    const imageUrl = await getDownloadURL(imageRef);
                    setProfileImageUrl(imageUrl);
                } catch (error) {
                    console.error("Error fetching profile image URL:", error);
                }
            }
        };
        fetchUserProfileImage();
    }, [user, storage]);

    return (
        <div className="sidebarIcon">
            {profileImageUrl ? (
                <img src={profileImageUrl} alt="User Icon" />
            ) : (
                <p>ユーザーアイコンがありません</p>
            )}
                <p>ログイン中のユーザー {user?.email}</p>
        </div>
    );
};

export default SidebarIcon;

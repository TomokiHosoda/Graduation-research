import { useEffect, useState } from "react";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import noicon from "../images/Noimage.png";

const UserProfileImage = ({ userId }: { userId: string }) => {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const storage = getStorage();
    const imageRef = ref(storage, `user-icons/${userId}`);

    getDownloadURL(imageRef)
      .then((imageUrl) => setProfileImageUrl(imageUrl))
      .catch((error) => {
        console.error("Error fetching user profile image URL:", error);
        setProfileImageUrl(noicon);
      });
  }, [userId]);

  return <img src={profileImageUrl || noicon} alt="User Icon" />;
};

export default UserProfileImage;
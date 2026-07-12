import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const saveFanpage = async (userId, cornerNickname, htmlContent) => {
  try {
    const fanpageRef = doc(db, "fanpages", cornerNickname);
    await setDoc(
      fanpageRef,
      {
        userId,
        cornerNickname,
        html: htmlContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: true,
      },
      { merge: true }
    );
    return { success: true, cornerNickname };
  } catch (err) {
    console.error("Error saving fanpage:", err);
    return { success: false, error: err.message };
  }
};

export const getFanpage = async (cornerNickname) => {
  try {
    const fanpageRef = doc(db, "fanpages", cornerNickname);
    const snap = await getDoc(fanpageRef);
    if (snap.exists()) {
      return { success: true, fanpage: snap.data() };
    }
    return { success: false, error: "Fanpage not found" };
  } catch (err) {
    console.error("Error fetching fanpage:", err);
    return { success: false, error: err.message };
  }
};

export const updateFanpage = async (cornerNickname, htmlContent) => {
  try {
    const fanpageRef = doc(db, "fanpages", cornerNickname);
    await setDoc(
      fanpageRef,
      {
        html: htmlContent,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (err) {
    console.error("Error updating fanpage:", err);
    return { success: false, error: err.message };
  }
};

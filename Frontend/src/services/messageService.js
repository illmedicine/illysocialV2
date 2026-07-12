import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export const sendMessage = async (cornerNickname, message, senderName = 'Anonymous') => {
  try {
    const messagesRef = collection(db, 'fanpages', cornerNickname, 'messages');
    await addDoc(messagesRef, {
      message: message.trim(),
      senderName: senderName.trim() || 'Anonymous',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    console.error('Error sending message:', err);
    return { success: false, error: err.message };
  }
};

export const subscribeToMessages = (cornerNickname, callback) => {
  try {
    const messagesRef = collection(db, 'fanpages', cornerNickname, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    });

    return unsubscribe;
  } catch (err) {
    console.error('Error subscribing to messages:', err);
    callback(null);
    return () => {};
  }
};

export const getMessages = async (cornerNickname) => {
  try {
    const messagesRef = collection(db, 'fanpages', cornerNickname, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    return new Promise((resolve, reject) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          resolve(messages);
          unsubscribe();
        },
        (err) => reject(err)
      );
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    return [];
  }
};

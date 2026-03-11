import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const DataContext = createContext();
export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      const promises = [getDocs(collection(db, 'items'))];
      if (currentUser) {
        promises.push(getDocs(collection(db, 'claims')));
        promises.push(getDocs(query(collection(db, 'notifications'), where('userId', '==', currentUser.uid))));
      }
      const results = await Promise.all(promises);
      setItems(results[0].docs.map((d) => ({ id: d.id, ...d.data() })));
      if (results[1]) setClaims(results[1].docs.map((d) => ({ id: d.id, ...d.data() })));
      if (results[2]) setNotifications(results[2].docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoaded(true);
    }
  }, [currentUser]);

  const fetchUsers = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error('Users fetch error:', err);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const lostItems = items.filter((i) => i.type === 'lost' && i.status === 'open');
  const foundItems = items.filter((i) => i.type === 'found' && i.status === 'open');
  const myClaims = currentUser ? claims.filter((c) => c.claimantId === currentUser.uid) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DataContext.Provider value={{
      items, claims, users, notifications, lostItems, foundItems, myClaims,
      unreadCount, loaded, refresh: fetchAll, fetchUsers,
      setItems, setClaims, setNotifications
    }}>
      {children}
    </DataContext.Provider>
  );
};

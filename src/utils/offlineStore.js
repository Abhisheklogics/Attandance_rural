// utils/offlineStore.js
import localforage from "localforage";

localforage.config({ name: "FaceApp" });

export const savePendingRegistration = async (payload) => {
  const pending = (await localforage.getItem("pendingRegs")) || [];
  pending.push(payload);
  await localforage.setItem("pendingRegs", pending);
};

export const getPendingRegistrations = () => localforage.getItem("pendingRegs");

export const clearPendingRegistrations = async () => {
  await localforage.setItem("pendingRegs", []);
};

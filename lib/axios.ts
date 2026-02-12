import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
  },
  PROFILE: {
    GET: "/users/profile",
    UPDATE: "/users/profile",
  },
  DASHBOARD: {
    OWNER: "/owner-dashboard",
    STUDENT: "/boardings/public",
    BOARDING_STATUS: "/student/boarding-status",
  },
  BOARDING: {
    GET_ALL: "/boardings",
    CREATE: "/boardings",
    UPDATE: (id: string) => `/boardings/${id}`,
    DELETE: (id: string) => `/boardings/${id}`,
  },
  ROOM: {
    GET_ALL: (boardingId: string) => `/rooms?boardingId=${boardingId}`,
    CREATE: "/rooms",
    UPDATE_BULK: "/rooms",
    UPDATE: (id: string) => `/rooms/${id}`,
    DELETE: (id: string) => `/rooms/${id}`,
  },
  BILL_TYPE: {
    GET_ALL: (roomId: string) => `/bill-types?roomId=${roomId}`,
    CREATE: "/bill-types",
    DELETE: (id: string) => `/bill-types/${id}`,
  },
  MONTHLY_BILL: {
    GET_ALL: (boardingId: string, month?: string) =>
      month
        ? `/monthly-bills?boardingId=${boardingId}&month=${month}`
        : `/monthly-bills?boardingId=${boardingId}`,
    SAVE: "/monthly-bills",
  },
  RENT_PAYMENT: {
    GET_ALL: (roomId: string, month: string) => `/rent-payments?roomId=${roomId}&month=${month}`,
    CREATE: "/rent-payments",
    UPDATE: (id: string) => `/rent-payments/${id}`,
  },
};

export default axiosInstance;

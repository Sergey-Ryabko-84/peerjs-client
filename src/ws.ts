import { io } from "socket.io-client";

export const ws = io(`${process.env.REACT_APP_BECKEND_URL}`);

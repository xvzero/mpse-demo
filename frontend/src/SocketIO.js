import socketIOClient from "socket.io-client";
import { server } from './lib/constants';

export default socketIOClient(server);
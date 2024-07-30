import { WebSocketServer } from "ws";

/**
 * init websocket server from http server
 * @param {import("http").Server} server
 */
export function initWebsocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", ws => {
        ws.on("message", data => {
            console.log(data);
        });
    });

    return wss;
}

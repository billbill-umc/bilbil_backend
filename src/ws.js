import { Server } from "socket.io";
import { verify } from "jsonwebtoken";
import logger from "@/config/logger";
import { createMessage, getChat } from "@/db/chat.dao";
import { getDuplicated } from "@/config/cache";
import { setLastMessageToCache } from "@/cache/chat";

/**
 * @param {string} token
 * @return {{sub: string, aud: number, exp: number: iat: number} | undefined}
 */
function authenticate(token) {
    const tokenSecret = process.env.TOKEN_SECRET;

    let decoded;

    try {
        decoded = verify(token, tokenSecret);
    } catch (e) {
        return;
    }

    return decoded;
}

/**
 * @param {any} message
 * @return {boolean}
 */
function isMessageObject(message) {
    return message && message.content && message.type && message.sentAt
        && typeof message.content === "string"
        && (message.type === "TEXT" || message.type === "IMAGE")
        && typeof message.type === "string"
        && typeof message.sentAt === "number";
}

// TODO: if can, refactoring namespace checking and authorization to middleware

/**
 * @param {import("http").Server} server
 */
export function initWebSocket(server) {
    const io = new Server(server);

    // dynamic namespace for /chattings/{ANY_NUMBER}
    io.of(/\/chattings\/[0-9]+/)
        .on("connection", async socket => {
            // namespace checking for get chat id
            const namespace = socket.nsp.name;

            // get chat id
            const chatId = Number(namespace.replace("/chattings/", ""));

            // check chat id is number
            if (isNaN(chatId)) {
                logger.info(`[Socket.io] Reject invalid chat id connecting from ${socket.request.socket.remoteAddress}`);
                return socket.disconnect(true);
            }

            // verify token
            const { token } = socket.handshake.auth;
            if (!token) return socket.disconnect(true);
            const decoded = authenticate(token);
            if (!decoded) {
                logger.info(`[Socket.io] Reject unauthorized connection from ${socket.request.socket.remoteAddress}`);
                return socket.disconnect(true);
            }

            // fetch chat from database
            const chat = await getChat(chatId);
            if (!chat) {
                logger.info(`[Socket.io] Reject invalid chat id connection from ${socket.request.socket.remoteAddress}`);
                return socket.disconnect(true);
            }

            // check chat is connected user's one
            if (!(chat.receiverId === decoded.aud || chat.senderId === decoded.aud)) {
                logger.info(`[Socket.io] Reject unauthorized connection from ${socket.request.socket.remoteAddress}`);
                return socket.disconnect(true);
            }

            logger.info(`[Socket.io] Connected from ${socket.request.socket.remoteAddress} by ${decoded.sub} (${decoded.aud})`);

            const pub = getDuplicated();
            const sub = getDuplicated();

            await pub.connect();
            await sub.connect();

            socket.on("disconnect", async () => {
                await pub.disconnect();
                await sub.disconnect();
                logger.info(`[Socket.io] Disconnect socket from ${socket.request.socket.remoteAddress} by ${decoded.sub} (${decoded.aud})`);
            });

            socket.on("NEW_MESSAGE", async message => {
                try {
                    if (isMessageObject(message)) {
                        const msgObj = {
                            ...message,
                            sentAt: Math.floor(new Date(message.sentAt).valueOf() / 1000),
                            authorId: decoded.aud
                        };
                        await pub.publish(`chat:${chatId}`, JSON.stringify(msgObj));
                        await setLastMessageToCache(chatId, chat.senderId === decoded.aud, msgObj);
                        await createMessage({
                            chatId: chatId,
                            senderId: decoded.aud,
                            type: message.type,
                            content: message.content,
                            createdAt: new Date(message.sentAt * 1000)
                        });
                    }
                } catch (e) {
                    logger.error("[Socket.io] Failed to processing incoming message.", e);
                }
            });

            await sub.subscribe(`chat:${chatId}`, async message => {
                const msgObj = JSON.parse(message);
                if (isMessageObject(msgObj)) {
                    socket.emit("NEW_MESSAGE", msgObj);
                }
            });
        });

    // reject all connection
    io.of(/.*/)
        .on("connection", socket => {
            socket.disconnect(true);
        });
}

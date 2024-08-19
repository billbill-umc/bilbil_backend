import { response, ResponseCode } from "@/config/response";
import { createChat, getChat, getChatList, getMessages, getUserForChat } from "@/db/chat.dao";
import { getLastMessageFromCache } from "@/cache/chat";
import { getPostImages } from "@/db/post.dao";

// TODO: CHECK LAST MESSAGE

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function GetChattingsService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const chatList = await getChatList(userId);

    const chatListWithLastMessage = await Promise.all(chatList.map(async chat => {
        const isSender = chat.senderId === userId ? "sender" : "receiver";
        const lastMessage = await getLastMessageFromCache(chat.id, isSender);

        let user;
        if (isSender === "sender") {
            user = await getUserForChat(chat.receiverId);
        } else {
            user = await getUserForChat(chat.senderId);
        }

        return {
            id: chat.id,
            post: {
                id: chat.postId,
                itemName: chat.postItemName,
                price: chat.postItemPrice,
                deposit: chat.postItemDeposit
            },
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatarUrl
            },
            lastMessage: lastMessage
                ? {
                    id: lastMessage.id,
                    senderId: lastMessage.senderId,
                    type: lastMessage.type,
                    content: lastMessage.content,
                    createdAt: lastMessage.createdAt
                }
                : null
        };
    }));

    return response(ResponseCode.SUCCESS, { chattings: chatListWithLastMessage });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function PostChattingService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const { postId } = req.body;

    if (!postId) {
        return response(ResponseCode.INVALID_CHAT_ID, null);
    }

    const chatId = await createChat(postId, userId, 1);

    return response(ResponseCode.SUCCESS, { chatId });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function GetChattingByIdService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const chattingId = Number(req.params.chattingId);

    if (isNaN(chattingId)) {
        return response(ResponseCode.NOT_FOUND, null);
    }

    const chatting = await getChat(chattingId);

    if (!chatting) {
        return response(ResponseCode.INVALID_CHAT_ID, null);
    }

    if (chatting.senderId !== userId && chatting.receiverId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const to = await getUserForChat(userId === chatting.senderId ? chatting.receiverId : chatting.senderId);
    const postImages = await getPostImages(chatting.postId);

    const messages = await getMessages(chattingId);
    const resultMessages = messages.map(m => ({
        id: m.id,
        byMe: m.senderId === userId,
        type: m.type,
        content: m.content,
        sentAt: Math.floor(m.createdAt.valueOf() / 1000)
    }));

    return response(ResponseCode.SUCCESS, {
        id: chatting.id,
        to: {
            id: to.id,
            username: to.username,
            avatar: to.avatarUrl
        },
        post: {
            id: chatting.postId,
            itemName: chatting.postItemName,
            price: chatting.postPrice,
            deposit: chatting.postDeposit,
            images: postImages
        },
        socketNamespace: `/chattings/${chattingId}`,
        messages: resultMessages
    });
}

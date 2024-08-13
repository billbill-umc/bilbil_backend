import { response, ResponseCode } from "@/config/response";
import { createChatImage, getChat, getChatWithImageMessages } from "@/db/chat.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<{success: boolean, response: unknown}>}
 */
export async function BeforeCreateChattingImageService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const chattingId = Number(req.params.chattingId);
    if (isNaN(chattingId)) return { success: false, response: response(ResponseCode.INVALID_CHAT_ID, null) };

    const chat = await getChat(chattingId);

    if (chat.senderId !== userId && chat.receiverId !== userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const chatWithImages = await getChatWithImageMessages(chattingId);

    if (!chatWithImages) {
        req.imageName = `chat/${chattingId}/images/image_1`;
    } else {
        req.imageName = `chat/${chattingId}/images/image_${chatWithImages.images.length + 1}`;
    }

    return { success: true };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function AfterCreateChattingImageService(req, res) {
    if (!req.file || !req.file.location) {
        throw new Error("Failed to upload chat image");
    }

    const [ insertedImageId ] = await createChatImage(Number(req.params.chattingId), req.file.location);

    return response(ResponseCode.SUCCESS, { image: { id: insertedImageId, url: req.file.location } });
}

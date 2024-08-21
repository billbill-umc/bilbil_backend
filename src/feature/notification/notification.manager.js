import { EventEmitter } from "events";
import { getQueryBuilder } from "@/config/db";

const NotificationEvents = {
    MY_POST_ADDED_FAVORITE: "MY_POST_ADDED_FAVORITE",
    NEW_RENT_REQUEST: "NEW_RENT_REQUEST",
    CANCEL_RENT_REQUEST: "CANCEL_RENT_REQUEST",
    ACCEPT_RENT_REQUEST: "ACCEPT_RENT_REQUEST",
    REJECT_RENT_REQUEST: "REJECT_RENT_REQUEST"
};

Object.freeze(NotificationEvents);

class NotificationManager extends EventEmitter {
    constructor() {
        super();
        this.notifications = [];
    }

    async #newNotification(event, data) {
        await getQueryBuilder()("notification")
            .insert(data);
        this.emit(event, data);
    }

    /**
     * @param {number} userId
     * @param {number} postId
     * @return {Promise<void>}
     */
    async newFavoriteNotification(userId, postId) {
        await this.#newNotification(NotificationEvents.MY_POST_ADDED_FAVORITE, {
            targetType: "MY_POST_ADDED_FAVORITE",
            targetId: postId,
            userId
        });
    }

    /**
     * @param {number} userId
     * @param {number} postId
     * @return {Promise<void>}
     */
    async newRentRequestNotification(userId, postId) {
        await this.#newNotification(NotificationEvents.NEW_RENT_REQUEST, {
            targetType: "NEW_RENT_REQUEST",
            targetId: postId,
            userId
        });
    }

    /**
     * @param {number} userId
     * @param {number} postId
     * @return {Promise<void>}
     */
    async cancelRentRequestNotification(userId, postId) {
        await this.#newNotification(NotificationEvents.CANCEL_RENT_REQUEST, {
            targetType: "CANCEL_RENT_REQUEST",
            targetId: postId,
            userId
        });
    }

    /**
     * @param {number} userId
     * @param {number} postId
     * @return {Promise<void>}
     */
    async acceptRentRequestNotification(userId, postId) {
        await this.#newNotification(NotificationEvents.ACCEPT_RENT_REQUEST, {
            targetType: "ACCEPT_RENT_REQUEST",
            targetId: postId,
            userId
        });
    }

    /**
     * @param {number} userId
     * @param {number} postId
     * @return {Promise<void>}
     */
    async rejectRentRequestNotification(userId, postId) {
        await this.#newNotification(NotificationEvents.REJECT_RENT_REQUEST, {
            targetType: "REJECT_RENT_REQUEST",
            targetId: postId,
            userId
        });
    }
}

const notificationManager = new NotificationManager;

export default notificationManager;

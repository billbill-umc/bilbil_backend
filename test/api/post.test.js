import { beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";
import { initExpress } from "@/app";

describe("Post API", () => {
    let app;

    beforeAll(async () => {
        await import("@/env");
        app = await initExpress();
    });

    it("should create a post", async () => {
        const postData = {
            authorId: 1,
            categoryId: 1,
            areaId: 1,
            itemName: "Test Item",
            price: 1000,
            deposit: 100,
            description: "Test Description",
            dateBegin: "2024-01-01",
            dateEnd: "2024-01-02",
            itemCondition: "New"
        };

        const response = await request(app)
            .post("/api/posts")
            .send(postData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("id");
    });

    it("should get all posts", async () => {
        const response = await request(app).get("/api/posts");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it("should get a post by ID", async () => {
        const postId = 1;
        const response = await request(app).get(`/api/posts/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("id", postId);
    });

    it("should update a post", async () => {
        const postId = 1;
        const updateData = {
            title: "Updated Title",
            content: "Updated Content"
        };

        const response = await request(app)
            .put(`/api/posts/${postId}`)
            .send(updateData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("title", updateData.title);
    });

    it("should delete a post", async () => {
        const postId = 1;
        const response = await request(app).delete(`/api/posts/${postId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("message", "게시물이 삭제되었습니다.");
    });
});

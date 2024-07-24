import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { initExpress } from "@/app";

describe("API - /test", () => {
    it("GET /test", async () => {
        const app = await initExpress();
        const response = await request(app).get("/test");
        console.log(response);
        expect(response.statusCode).toBe(200);
    });
});

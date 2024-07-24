import passport from "passport";
import BearerStrategy from "passport-http-bearer";
import { verify } from "jsonwebtoken";
import logger from "@/config/logger";

if (!process.env.TOKEN_SECRET) {
    logger.error("TOKEN_SECRET not set in .env file");
    process.exit(1);
}

export class Passport401Error extends Error {
    constructor() {
        super("401 Unauthorized");
        this.status = 401;
    }
}

passport.use(new BearerStrategy.Strategy((token, done) => {
    verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            const e = new Passport401Error;
            return done(e);
        }

        done(null, decoded);
    });
}));

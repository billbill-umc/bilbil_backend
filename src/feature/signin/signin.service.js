import { response, ResponseCode } from "@/config/response";
import { sendMail } from "@/config/mail";
import { randomBytes } from "crypto";
import zod, { ZodError } from "zod";
import { getCache } from "@/config/cache";
import { generateSalt, hashingPassword } from "@/util/password";
import { createUser } from "@/db/user.dao";

function getSignInMailKey(stateCode) {
    return `__SIGNIN_MAIL_${stateCode}`;
}

function generateSignInMailHtml(authCode) {
    return `
        <h1>빌빌에 오신것을 환영합니다!</h1>
        <h3>아래의 인증 코드를 입력해주세요</h3>
        <p>${authCode}</p>
    `;
}

function getSignInVerifiedMailKey(email) {
    return `__SIGNIN_VERIFIED_${email}`;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreateSignInMailService(req, res) {
    const createSignInMailBodySchema = zod.object({
        email: zod.string().email()
            .endsWith(".ac.kr")
    });

    // validate email
    try {
        createSignInMailBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }
    const targetEmail = req.body.email;

    const cache = await getCache();

    // generate state code
    let stateCode;
    while (true) {
        stateCode = randomBytes(12).toString("hex");
        if (!await cache.exists(getSignInMailKey(stateCode))) {
            break;
        }
    }

    // generate auth code
    const authCode = randomBytes(3).toString("hex");
    const state = {
        authCode, email: targetEmail
    };

    // set state, auth, email to cache with 10 minutes
    await cache.set(getSignInMailKey(stateCode), JSON.stringify(state), "EX", 60 * 10);
    await cache.disconnect();

    // send email
    const mailRes = await sendMail("bilbil <solid2113@naver.com>", targetEmail, "빌빌 회원가입 메일 인증 코드", generateSignInMailHtml(authCode));


    if (!mailRes.accepted.find(a => a === targetEmail)) {
        return response(ResponseCode.INVALID_EMAIL_ADDRESS, null);
    }

    return response(ResponseCode.SUCCESS, { stateCode });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function VerifyEmailService(req, res) {
    const signInMailVerifyBodySchema = zod.object({
        email: zod.string().email()
            .endsWith(".ac.kr"),
        stateCode: zod.string(),
        authCode: zod.string()
    });

    try {
        signInMailVerifyBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const { email, stateCode, authCode } = req.body;

    const cache = await getCache();
    const state = JSON.parse(await cache.get(getSignInMailKey(stateCode)));

    if (!state || state.email !== email || state.authCode !== authCode) {
        return response(ResponseCode.CODE_NOT_MATCH, null);
    }

    await cache.set(getSignInVerifiedMailKey(email), "true", "EX", 60 * 30);
    await cache.disconnect();

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function SignInService(req, res) {
    const signInBodySchema = zod.object({
        email: zod.string().email()
            .endsWith(".ac.kr"),
        id: zod.string().min(8)
            .max(32)
            .regex(/^[a-zA-Z0-9]*$/),
        password: zod.string().min(12)
            .max(32),
        phoneNumber: zod.string().regex(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/)
    })
        .superRefine(({ password }, checkPassComplexity) => {
            // password complexity validation (at least 1 uppercase, 1 lowercase, 1 number, 1 special character)
            const containsUppercase = ch => /[A-Z]/.test(ch);
            const containsLowercase = ch => /[a-z]/.test(ch);
            const containsSpecialChar = ch => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
            let countOfUpperCase = 0,
                countOfLowerCase = 0,
                countOfNumbers = 0,
                countOfSpecialChar = 0;
            for (let i = 0; i < password.length; i++) {
                let ch = password.charAt(i);
                if (!isNaN(+ch)) countOfNumbers++;
                else if (containsUppercase(ch)) countOfUpperCase++;
                else if (containsLowercase(ch)) countOfLowerCase++;
                else if (containsSpecialChar(ch)) countOfSpecialChar++;
            }
            if (
                countOfLowerCase < 1
                || countOfUpperCase < 1
                || countOfSpecialChar < 1
                || countOfNumbers < 1
            ) {
                checkPassComplexity.addIssue({
                    code: "INVALID_PASSWORD",
                    message: "password does not meet complexity requirements"
                });
            }
        });

    try {
        signInBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const cache = await getCache();
    if (!await cache.exists(getSignInVerifiedMailKey(req.body.email))) {
        return response(ResponseCode.INVALID_EMAIL_ADDRESS, null);
    }

    const salt = generateSalt();
    const hashedPassword = await hashingPassword(req.body.password, salt);

    await createUser(req.body.email, req.body.id, hashedPassword, salt, req.body.id, req.body.phoneNumber);

    await cache.del(getSignInVerifiedMailKey(req.body.email));
    await cache.disconnect();

    return response(ResponseCode.SUCCESS, null);
}


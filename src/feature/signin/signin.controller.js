import { CreateSignInMailService, SignInService, VerifyEmailService } from "@/feature/signin/signin.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreateSignInMailController(req, res) {
    const response = await CreateSignInMailService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function VerifyEmailController(req, res) {
    const response = await VerifyEmailService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function SignInController(req, res) {
    const response = await SignInService(req, res);
    res.send(response);
}

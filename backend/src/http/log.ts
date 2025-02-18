import { Request, Response, Router } from "express";

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Logging for debug
 */
const logRouter = Router();

/**
 * @swagger
 * /log/auth:
 *   get:
 *     summary: Log authentication details
 *     tags: [Logs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authentication details logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged auth details on server console."
 */
logRouter.all("/auth", logAuth);
export default logRouter;

function logAuth(req: Request, res: Response) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Bearer token: ", token);
  console.log("User: ", req.user);
  res.json({ message: "Logged auth details on server console." });
}

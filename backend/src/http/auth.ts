import { NextFunction, Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByName } from "../db/user";
import { prisma } from "..";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 *
 * components:
 *   schemas:
 *     UserCredentials:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           example: "testuser"
 *         password:
 *           type: string
 *           example: "SecurePass123"
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Success"
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR..."
 *     ServerErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Server error"
 *
 *   responses:
 *     AuthSuccess:
 *       description: Login successful
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthSuccessResponse"
 *     ServerError:
 *       description: Server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ServerErrorResponse"
 */
const authRouter = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCredentials"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/AuthSuccess"
 *       400:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
authRouter.post("/login", loginUser);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCredentials"
 *     responses:
 *       200:
 *         $ref: "#/components/responses/AuthSuccess"
 *       400:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with username already exists"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
authRouter.post("/register", registerUser);

export default authRouter;

async function registerUser(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    const existingUser = await findUserByName(username);

    if (existingUser) {
      res.status(400).json({ message: "User with username already exists" });
      return;
    }

    const newUser = await createUser(username, password);

    const token = generateToken(newUser.id);
    res.status(201).json({ message: "Success", token });
  } catch (error) {
    console.error("Error during register: \n", error);
    res.status(500).json({ message: "Server error" });
  }
}

async function loginUser(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    const user = await findUserByName(username);

    //Invalid username
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    //Invalid password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = generateToken(user.id);
    res.json({ message: "Success", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Error during login: \n", error);
  }
}

// Helper function to generate JWT
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, "your_secret_key", { expiresIn: "1h" });
};

export async function extractUserFromToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    if (typeof decoded !== "object") {
      throw Error;
    }

    const userId = decoded.userId as string;
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
    return;
  }
}

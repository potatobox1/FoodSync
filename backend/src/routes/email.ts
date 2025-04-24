import { Router, Request, Response } from "express";
import { sendEmail } from "../controller/email";

const router = Router();

router.post("/send-email", async (req: Request, res: Response) => {
  const { to, subject, html } = req.body;

  try {
    await sendEmail(to, subject, html);
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: "Failed to send email." });
  }
});

export default router;

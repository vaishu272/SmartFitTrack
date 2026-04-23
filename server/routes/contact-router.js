import express from "express";
import { contactForm } from "../controllers/contact-controller.js";
import { validate } from "../middlewares/validate-middleware.js";
import { contactSchema } from "../validators/contact-validator.js";

const router = express.Router();

router.post("/contact", validate(contactSchema), contactForm);

export default router;

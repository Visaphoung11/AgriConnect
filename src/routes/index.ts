import { Router } from "express";

import authRoute from "./authRoute";
import roleRoute from "./roleRoute";
import userRoleRoute from "./userRoleRoute";
import userRoute from "./userRoute";

const router = Router();

router.use("/auth", authRoute);
router.use("/roles", roleRoute);
router.use("/user-roles", userRoleRoute);
router.use("/users", userRoute);

export default router;




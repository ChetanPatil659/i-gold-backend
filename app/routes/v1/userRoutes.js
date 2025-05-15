import { Router } from "express";
import {
  user_add_address,
  registerSafeGold,
  user_delete,
  user_delete_address,
  user_get_profile,
  user_login_register,
  user_logout,
  user_update_address,
  user_verify_otp,
  user_complete_name,
  user_complete_age,
  user_complete_gender,
} from "../../controllers/v1/userController.js";
import { authenticate } from "../../middlewares/authMiddleware.js";

const userRouter = Router();

userRouter.get("/user/profile", authenticate, user_get_profile);

userRouter.post("/user/login", user_login_register);

userRouter.post("/user/verify-otp", user_verify_otp);

userRouter.post("/user/logout", authenticate, user_logout);

userRouter.delete("/user/delete", authenticate, user_delete);

userRouter.put("/user/complete-safegold", authenticate, registerSafeGold);

userRouter.put("/user/complete-name", authenticate, user_complete_name);

userRouter.put("/user/complete-age", authenticate, user_complete_age);

userRouter.put("/user/complete-gender", authenticate, user_complete_gender);

userRouter.post("/user/add-address", authenticate, user_add_address);

userRouter.put("/user/update-address", authenticate, user_update_address);

userRouter.delete("/user/delete-address", authenticate, user_delete_address);

export default userRouter;

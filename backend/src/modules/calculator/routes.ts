import { Router } from "express";
import { melimc } from "./logic";

const router = Router();

router.post("/melimc", (req, res) => {
    const result = melimc(req.body);
    res.json(result);
});

export default router;

const router = require("express").Router();
const userCtrl = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get("/me", auth, userCtrl.getProfile);
router.put("/me", auth, userCtrl.updateProfile);

// admin only
router.get("/", auth, userCtrl.listUsers);

module.exports = router;

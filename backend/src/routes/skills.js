const router = require("express").Router();
const skillCtrl = require("../controllers/skillController");
const auth = require("../middleware/auth");

router.post("/", auth, skillCtrl.createSkill);
router.get("/", auth, skillCtrl.listSkills);

module.exports = router;

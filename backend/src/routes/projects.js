const router = require("express").Router();
const projectCtrl = require("../controllers/projectController");
const auth = require("../middleware/auth");

router.post("/", auth, projectCtrl.createProject);
router.get("/open", auth, projectCtrl.listOpenProjects);

module.exports = router;

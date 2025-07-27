const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");
const db = require("../config/connection"); //required for quiz score queries

router.get("/", ({ session: { isLoggedIn } }, res) => {
  res.render("index", { isLoggedIn });
});

router.get("/login", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("login", { error: req.query.error });
});

router.get("/signup", async (req, res) => {
  if (req.session.isLoggedIn) return res.redirect("/");
  res.render("signup", { error: req.query.error });
});

//checks user id and pulls their scores from database on the protected/quiz page
router.get("/private", checkAuth, async (req, res) => {
  
  let history = [];

  try {
    const userId = req.session.userId;

    if (userId) {
      const [rows] = await db.execute(
        `SELECT category_id, COUNT(*) AS attempts, SUM(correct) AS total_correct, SUM(wrong) AS total_wrong
        FROM scores
        WHERE user_id = ?
        GROUP BY category_id`, [userId]
      );

      const categoryNames = {
        9: "General Knowledge",
        17: "Science & Nature",
        25: "Art",
        23: "History",
        22: "Geography",
        21: "Sports"
      };

      history = rows.map(row => ({
        name: categoryNames[row.category_id] || `Category ${row.category_id}`,
        attempts: row.attempts,
        total_correct: row.total_correct,
        total_wrong: row.total_wrong
      }));
    }
  } 

  catch (error) {
    console.error("Cant pull score", error);
  }

  res.render("protected", {
    isLoggedIn: req.session.isLoggedIn || false,
    history
  });
});

module.exports = router;

const router = require("express").Router();
const controllers = require("../controllers");
const checkAuth = require("../middleware/auth");
const db = require("../config/connection"); //required for quiz score queries

// admin login/logout
router.post("/login", controllers.auth.login);
router.post("/signup", controllers.user.create);
router.get("/logout", controllers.auth.logout);

//posts score to users lifetime quiz history

router.post("/score", checkAuth, async (req, res) => {
  const { category_id, correct, wrong } = req.body;
  const userId = req.session.userId; 

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await db.execute(
      "INSERT INTO scores (user_id, category_id, correct, wrong) VALUES (?, ?, ?, ?)",
      [userId, category_id, correct, wrong]
    );

    res.json({ success: true });
  } 
  
  catch (error) {
    console.error("Cant save score", error);
    res.status(500).json({ error: "Server error" });
  }
});

//gets lifetime score history for the user

router.get("/score/history", checkAuth, async (req, res) => {
  const userId = req.session.userId;

  if (!userId) 
    return res.json([]);

  try {
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

    const history = rows.map(row => ({
      name: categoryNames[row.category_id] || `Category ${row.category_id}`,
      attempts: row.attempts,
      total_correct: row.total_correct,
      total_wrong: row.total_wrong
    }));

    res.json(history);
  } 
  
  catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

exports.getAspiredRole = async (req, res) => {
  try {
    const { userId } = req.params;

    const role = await AspiredRole.findOne({
      where: { userId },
      order: [["created_at", "DESC"]], // get latest saved
    });

    if (!role) {
      return res.status(404).json({ message: "No aspired role found" });
    }

    res.json(role);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

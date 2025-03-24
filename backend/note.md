// Create User
app.post("/create-account", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!name) {
      return res
        .status(400)
        .json({ message: "Username is required", error: true });
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", error: true });
    }

    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required", error: true });
    }

    const existsUser = await User.findOne({ email });
    if (existsUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = new User({
      username: name,
      email,
      password: hashedPassword,
    });

    const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_KEY, {
      expiresIn: "36000m",
    });

    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Account created successfully",
      accessToken,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Server error", details: error.message });
  }
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    if (!email) {
      return res
        .status(404)
        .json({ error: true, message: "Email is required" });
    }

    if (!password) {
      return res
        .status(404)
        .json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res.status(404).json({ error: true, message: "No user found" });
    }

    const compare = await bcrypt.compare(password, userInfo.password);

    if (!compare) {
      return res
        .status(404)
        .json({ error: true, message: "Invalid Credentials" });
    }

    const user = { user: userInfo };

    const accessToken = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
      expiresIn: "36000m",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      accessToken,
      user: userInfo,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Server Error", details: error.message });
  }
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const isUser = await User.findById(user._id);

    if (!isUser) {
      return res.sendStatus(401);
    }

    res.status(200).json({
      user: {
        username: isUser.username,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  try {
    const note = new Note({
      title,
      content,
      userId: user._id,
      tags: tags || [],
    });

    await note.save();

    return res.status(200).json({
      success: true,
      message: "Note Created Successfully",
      note: note,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Server Error", details: error.message });
  }
});

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndUpdate(
      noteId,
      { $set: req.body },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

// Edit IsPinned Note
app.put("/edit-pinned-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { isPinned } = req.body;

    const note = await Note.findByIdAndUpdate(
      noteId,
      { $set: { isPinned } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note isPinned updated successfully", note });
  } catch (error) {
    return res.status(500).json("Server Error");
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    console.log("New User");
    console.log(user._id);
    const allNotes = await Note.find({ userId: user._id }).sort({
      isPinned: -1,
    });

    return res.status(200).json({
      notes: allNotes,
      message: "All notes retreived successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server Errror" });
  }
});

// Search for notes
app.get("/search-note", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
      return res
        .status(400)
        .json({ error: true, message: "Search is required" });
    }

    const response = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    res.status(200).json({
      error: false,
      notes: response,
      message: "Notes matching the search query retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server Errror" });
  }
});
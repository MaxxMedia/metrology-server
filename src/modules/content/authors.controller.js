/** Implements HTTP request handlers for content operations. */
import prisma from "../../shared/lib/prisma.js";

/** Retrieves authors data for this workflow. */
export const getAuthors = async (req, res) => {
  try {
    const authors = await prisma.author.findMany();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Add this new function
export const createAuthor = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const author = await prisma.author.create({
      data: { name, bio, avatarUrl },
    });

    res.status(201).json(author);
  } catch (error) {
    console.error("Error creating author:", error);
    res.status(500).json({ error: "Failed to create author" });
  }
};

/** Updates the author state for this workflow. */
export const updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, bio, avatarUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const author = await prisma.author.update({
      where: { id: Number(id) },
      data: { name, bio, avatarUrl },
    });

    res.json(author);
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ error: error.message || "Failed to update author" });
  }
};

/** Removes or disables the author record through this workflow. */
export const deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.author.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    console.error("Error deleting author:", error);
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Cannot delete author linked to existing posts" });
    }
    res.status(500).json({ error: error.message || "Failed to delete author" });
  }
};


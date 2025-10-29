// const books = require('../model/demoModel'); 


// exports.createBook = async (req, res) => {
//   try {
//     const newBook = new books(req.body); 
//     await newBook.save();
//     res.status(201).json({ message: "New Book added", book: newBook });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Book creation failed", error: err.message });
//   }
// };


// exports.getBooks = async (req, res) => {
//   try {
//     const allBooks = await books.find()
//     res.status(200).json({ message: "Fetched all books", books: allBooks });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch books", error: err.message });
//   }
// };

// exports.updateBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await books.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updated) {
//       return res.status(404).json({ message: "Book not found" });
//     }
//     res.status(200).json({ message: "Book updated", book: updated });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Update failed", error: err.message });
//   }
// };




// exports.deleteBook = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await books.findByIdAndDelete(id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Book not found" });
//     }
//     res.status(200).json({ message: "Book deleted", book: deleted });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Delete failed", error: err.message });
//   }
// };
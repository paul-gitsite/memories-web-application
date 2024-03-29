import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
    try {
        const postMessages = await PostMessage.find();
        res.status(200).json(postMessages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("Invalid Post ID");

    try {
        const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, _id }, { new: true });

        if (!updatedPost)
            return res.status(404).send("No Post found with this ID");

        res.json(updatedPost);
    } catch (error) {
        console.error("Error updating post:", error.message);
        res.status(500).send("Internal Server Error");
    }
};

export const deletePost = async (req, res) => {

    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("Invalid Post ID");

    await PostMessage.findByIdAndDelete(id)
    res.json({ message: "Post deleted sucessfully" })

}

export const likePost = async (req, res) => {
    const { id } = req.params
    if (!req.userId) return res.json({ message: 'Unauthenticated.' })

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send("Invalid Post ID");

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {
        post.likes.push(req.userId)
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
}

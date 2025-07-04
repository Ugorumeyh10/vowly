import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

function CommentSection({ mediaId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const { token, isAuthenticated } = useAuth();

  const fetchComments = useCallback(async () => {
    if (!mediaId) return;
    setFetchError(null);
    try {
      const response = await fetch(`https://vowly-backend.vowly.workers.dev/media/${mediaId}/comments`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setFetchError("Could not load comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [mediaId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`https://vowly-backend.vowly.workers.dev/media/${mediaId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });
      if (!response.ok) throw new Error("Could not post comment.");
      
      setNewComment("");
      fetchComments(); // Refresh comments
    } catch (error) {
      console.error("Failed to post comment:", error);
      setSubmitError(error.message || "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Comments</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
        {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
        {loading && <p>Loading comments...</p>}
        {!loading && !fetchError && comments.length === 0 && <p className="text-sm text-gray-500">No comments yet. Be the first!</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="text-sm bg-gray-50 p-2 rounded">
            <p className="text-gray-700">{comment.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              - {comment.author} on {new Date(comment.timestamp).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
        ))}
      </div>
      {isAuthenticated && (
        <div className="mt-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="flex-grow border border-gray-300 rounded-md p-2 text-sm focus:ring-rose-500 focus:border-rose-500" />
            <button type="submit" disabled={isSubmitting} className="bg-rose-500 text-white px-4 py-2 rounded-md text-sm hover:bg-rose-600 transition duration-200 disabled:bg-gray-400">
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </form>
          {submitError && <p className="text-red-500 text-sm mt-1">{submitError}</p>}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
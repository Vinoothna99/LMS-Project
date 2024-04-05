import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

function Comments() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const location = useLocation();
    const { username, courseTitle } = location.state; // Assuming these are passed correctly

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        const response = await fetch(`api/comments/?title=${courseTitle}`);
        if (response.ok) {
            const data = await response.json();
            setComments(data['course comments'].sort((a, b) => new Date(b.comment_date) - new Date(a.comment_date)));
        }
    };

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const submitComment = async () => {
        const commentData = {
            username,
            title: courseTitle,
            comment: newComment
        };

        const response = await fetch('api/writecomment/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            setNewComment('');
            fetchComments(); // Refresh comments to include the new one
        }
    };

    return (
        <div>
            <Typography variant="h4">{courseTitle}</Typography>
            <TextField
                label="Write a comment"
                value={newComment}
                onChange={handleCommentChange}
                fullWidth
                margin="normal"
            />
            <Button
                variant="contained"
                onClick={submitComment}
                disabled={!newComment.trim()}
            >
                Comment
            </Button>
            {comments.map((comment, index) => (
                <Card key={index} sx={{ marginBottom: 2 }}>
                    <CardContent>
                        <Typography variant="h6">
                            {comment.username} <span style={{ fontSize: 'smaller' }}>({comment.user_role})</span>
                        </Typography>
                        <Typography color="textSecondary">
                            {comment.comment_date}
                        </Typography>
                        <Typography variant="body1">
                            {comment.comment}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default Comments;

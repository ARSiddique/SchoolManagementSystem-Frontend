import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/userRelated/userHandle";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const { loading, response, error } = useSelector((state) => state.user);
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Typography variant="h4">Forgot Password</Typography>
            <Typography>Please enter your email to reset your password.</Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: "1rem" }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>
            </form>
            {response && <Typography color="green">{response}</Typography>}
            {error && <Typography color="red">{error}</Typography>}
        </div>
    );
};

export default ForgotPasswordPage;

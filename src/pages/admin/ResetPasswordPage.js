import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../redux/userRelated/userHandle";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

const ResetPasswordPage = () => {
    const dispatch = useDispatch();
    const { token } = useParams();
    const { loading, response, error } = useSelector((state) => state.user);
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(token, password));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Typography variant="h4">Reset Password</Typography>
            <Typography>Please enter a new password.</Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ marginBottom: "1rem" }}
                />
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Reset Password"}
                </Button>
            </form>
            {response && <Typography color="green">{response}</Typography>}
            {error && <Typography color="red">{error}</Typography>}
        </div>
    );
};

export default ResetPasswordPage;

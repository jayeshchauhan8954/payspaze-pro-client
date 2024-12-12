import React, { useState } from "react";
import { useFormik } from "formik";
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    CircularProgress,
    Typography,
    Container,
    Grid,
} from "@mui/material";
import { apiRequest } from "../../utils/apiRequest";
import { BASE_URL } from "../../api/base_url";
import { paymentValidationSchema } from "./validation";
import { useNavigate } from "react-router-dom";

const PaymentDialog = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            to: "",
            from: "",
            amount: "",
            description: "",
        },
        validationSchema: paymentValidationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const response = await apiRequest({
                    endUrl: `${BASE_URL}/app/payment`,
                    method: "POST",
                    body: values,
                    showMsg: true,
                });

                setLoading(false);
                if (response.message === 'Unauthorized access.') {
                    navigate('/sign-in')
                }
                switch (response.status) {
                    case 200:
                        console.log("Payment successful:", response.data);
                        break;
                    case 400:
                        console.error("Validation error:", response.errors);
                        break;
                    case 500:
                        console.error("Server error:", response.errors);
                        break;
                    default:
                        console.error("Unexpected error:", response);
                }
            } catch (error) {
                setLoading(false);
                console.error("API call failed", error);
            }
        },
    });

    const handleClose = () => {
        setOpen(false);
        formik.resetForm();
    };

    return (
        <Container>
            <Grid
                container
                direction="column"
                height={"65vh"}
                justifyContent={"center"}
                alignItems="center"
                spacing={2}
            >
                <Grid item>
                    <Typography variant="h4" align="center">
                        Make a Payment
                    </Typography>
                    <Typography variant="body1" align="center">
                        Click the button below and fill out the form to complete your payment.
                    </Typography>
                </Grid>
                <Grid item>
                    <Button variant="contained" onClick={() => setOpen(true)}>
                        Payment Button
                    </Button>
                </Grid>
                <Grid item>
                    <Dialog open={open} onClose={handleClose}>
                        <DialogTitle>Make a Payment</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="To"
                                name="to"
                                type="email"
                                fullWidth
                                required
                                value={formik.values.to}
                                onChange={formik.handleChange}
                                error={formik.touched.to && Boolean(formik.errors.to)}
                                helperText={formik.touched.to && formik.errors.to}
                                margin="dense"
                            />
                            <TextField
                                label="From"
                                name="from"
                                select
                                fullWidth
                                required
                                value={formik.values.from}
                                onChange={formik.handleChange}
                                error={formik.touched.from && Boolean(formik.errors.from)}
                                helperText={formik.touched.from && formik.errors.from}
                                margin="dense"
                            >
                                <MenuItem value="" disabled>
                                    Select Currency
                                </MenuItem>
                                <MenuItem value="BTC">BTC</MenuItem>
                                <MenuItem value="ETH">ETH</MenuItem>
                            </TextField>
                            <TextField
                                label="Amount"
                                name="amount"
                                type="number"
                                fullWidth
                                required
                                value={formik.values.amount}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value));
                                    formik.setFieldValue("amount", value);
                                }}
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                                margin="dense"
                            />
                            <TextField
                                label="Description"
                                name="description"
                                type="text"
                                fullWidth
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                margin="dense"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Grid
                                container
                                direction="row"
                                justifyContent={"center"}
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid item xs={6} md={5}>
                                    <Button onClick={handleClose} fullWidth disabled={loading}>
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item xs={6} md={5}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={formik.handleSubmit}
                                        disabled={loading || !formik.isValid || !formik.dirty}
                                        startIcon={loading && <CircularProgress size={20} />}
                                    >
                                        {loading ? "Processing..." : "Submit"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </DialogActions>
                    </Dialog>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PaymentDialog;

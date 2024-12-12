import React, { useState } from "react";
import { useFormik } from "formik";
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Container,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import { AiTwotoneLock, AiTwotoneMail } from "react-icons/ai";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { apiRequest } from "../../utils/apiRequest";
import { BASE_URL } from "../../api/base_url";
import { _signupSchema } from "./validation";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const handleSignup = async (values) => {
    setLoading(true);
    try {
      const {  status } = await apiRequest({
        endUrl: `${BASE_URL}/user/register`,
        method: "POST",
        body: values,
        showMsg: true,
      });
      setLoading(false);

      if (status) {
        console.log("Signup successful");
        // Handle successful signup (e.g., navigate to login)
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      setLoading(false);
      console.error("Signup failed", error);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: _signupSchema,
    onSubmit: handleSignup,
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Box
        sx={{
          padding: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: <AiTwotoneMail style={{ marginRight: 8 }} />,
              }}
            />
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: <AiTwotoneLock style={{ marginRight: 8 }} />,
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box mb={3}>
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              InputProps={{
                startAdornment: <AiTwotoneLock style={{ marginRight: 8 }} />,
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Signing up..." : "Signup"}
          </Button>

          <Box mt={3} textAlign="center">
            <Link to="/sign-in" underline="hover">
              <Typography variant="body2" color="primary">
                Already have an account? Login
              </Typography>
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;

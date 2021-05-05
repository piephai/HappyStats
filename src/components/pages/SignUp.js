import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

/*Next thing to do is to call this with several different APIs. Should be the same request with login and registration*/

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const history = useHistory();
  const [errorOpen, setErrorOpen] = useState(false);

  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response;
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  //Handle submit requests
  const submit = async (e) => {
    setIsSending(true);
    console.log(`Current email: ${email}\nCurrent Password: ${passWord}`);
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: `${email}`, password: `${passWord}` }),
    };
    await fetch("http://131.181.190.87:3000/user/register", requestOptions)
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => history.push("/sign-in"))
      .catch((err) => {
        if (err.message === "409") {
          setErrorOpen(true);
          setError(`User already exists`);
          setIsSending(false);
        } else {
          setErrorOpen(true);
          setError(
            `Request body incomplete, both email and password are required`
          );
          setIsSending(false);
        }
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={isSending}
            onClick={submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Snackbar
          open={errorOpen}
          autoHideDuration={5000}
          onClose={handleSnackClose}
        >
          <Alert onClose={handleSnackClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

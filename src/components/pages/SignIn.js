import React, { useState, useContext } from "react";
import { useLastLocation } from "react-router-last-location";
import { useHistory } from "react-router-dom";
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
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Paper from "@material-ui/core/paper";

import { UserContext } from "../context/UserContext";
import FlowerImage from "../../images/flower-image.jpg";

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    backgroundImage: `url(${FlowerImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "90vh",
  },
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  textDesign: {
    color: "white",
  },
  floatingLabel: {
    backgroundColor: "white",
    color: "white",
    border: "1px solid #ced4da",
    borderRadius: 4,
  },

  dontHaveAnAccount: {
    color: "white",
    marginTop: "2vh",
    size: "4rem",
  },
}));

//Handle sign-in
const SignIn = () => {
  const classes = useStyles();
  const history = useHistory();
  const lastLocation = useLastLocation();

  const [email, setEmail] = useState("");
  const [passWord, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [errorOpen, setErrorOpen] = useState(false);

  //Handle errors by checking if the response was okay if not throw an error with the response status code
  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response;
  };

  //If a user select close on the error message that pops up on the bottom of the screen
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
    await fetch("http://131.181.190.87:3000/user/login", requestOptions)
      .then(handleErrors)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .then(() => {
        //Check if the previous route was sign-up if it is then go back to home instead
        if (lastLocation.pathname == "/sign-up") {
          history.push("/home");
        }
        //If previous route was nto sign-up then go back to the previous route
        else {
          history.goBack();
        }
      })
      //If response status was 401 then throw the error of incorrect email
      //or password otherwise throw the error message of incomplete forms
      .catch((err) => {
        if (err.message === "401") {
          setErrorOpen(true);
          setError(`Incorrect email or password`);
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
    <Paper className={classes.container}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography
            component="h1"
            variant="h5"
            className={classes.textDesign}
          >
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              className={classes.floatingLabel}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              className={classes.floatingLabel}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isSending}
              onClick={submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={() => history.push("/sign-up")}
                  variant="body2"
                  className={classes.dontHaveAnAccount}
                  fontWeight="boulder"
                >
                  {"Don't have an account? Sign Up"}
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
    </Paper>
  );
};

export default SignIn;

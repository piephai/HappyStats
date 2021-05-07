import React, { useState, useEffect, useContext } from "react";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
// import "./Navbar.css";
import { UserContext } from "../components/context/UserContext";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const { user, setUser } = useContext(UserContext);
  const [buttonText, setButtonText] = useState("SIGN IN");
  const [linkToPage, setLinkToPage] = useState("/sign-in");
  const history = useHistory();

  //Change the state of click to the opposite of what it is currently
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const handleSignOut = () => {
    if (user) {
      setClick(false);
      setUser(null);
    }
    setClick(false);
    history.push(`${linkToPage}`);
  };

  const buttonOption = () => {
    if (user) {
      setButtonText("SIGN OUT");
      setLinkToPage("/home");
    } else {
      setButtonText("SIGN IN");
      setLinkToPage("/sign-in");
    }
  };

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  // useEffect(() => {
  //   showButton();
  // }, []);

  useEffect(() => {
    buttonOption();
  }, [user]);

  // window.addEventListener("resize", showButton);

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h5"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            Happy Stats
          </Typography>
          <nav>
            <Link
              variant="button"
              color="textPrimary"
              onClick={() => history.push("/home")}
              className={classes.link}
            >
              Home
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              onClick={() => history.push("/ranking")}
              className={classes.link}
            >
              Ranking
            </Link>
            <Link
              variant="button"
              color="textPrimary"
              onClick={() => history.push("/factors")}
              className={classes.link}
            >
              Factors
            </Link>
          </nav>
          <Button
            onClick={handleSignOut}
            color="primary"
            variant="outlined"
            className={classes.link}
          >
            {buttonText}
          </Button>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;

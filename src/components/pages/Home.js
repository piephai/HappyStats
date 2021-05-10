import React from "react";
import BarChart from "../RankingChart";
import SmilingImage from "../../images/smiling-people.jpeg";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    backgroundImage: `url(${SmilingImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "90vh",
    justifyContent: "center",
    alignItems: "center",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textDesign: {
    color: "white",
    fontSize: "6rem",
    textShadow:
      " 0.02em 0 black,       0 0.02em black,   -0.02em 0 black,       0 -0.02em black,        -0.02em -0.02em black,       -0.02em 0.02em black,       0.02em -0.02em black,       0.02em 0.02em black;",
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.container}>
      <Typography component="h1" variant="h2" className={classes.textDesign}>
        Happy Statistics
      </Typography>
    </Paper>
  );
};

export default Home;

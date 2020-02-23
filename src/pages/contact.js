import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

import CardLayout from "../components/cardLayout";
import Layout from "../components/mainLayout";
import ProgressLayout from "../components/progressLayout";

import Grow from "@material-ui/core/Grow";
import {
  Grid,
  Card,
  FormControl,
  FormHelperText,
  Typography,
  Icon,
  Input,
  InputBase,
  InputLabel,
  IconButton,
  Paper,
  TextField,
  Button,
} from "@material-ui/core";
import { FaLinkedinIn,FaGithub,FaDev, } from 'react-icons/fa';

import "../styles/main.scss";

export default ({ data }) => (
  <Layout pageStyle={"contact-page"}>
    <Grid container direction="column" alignItems="flex-start" justify="space-between">
      <Grid item>
        <h2>Contact Me</h2>
        <h5>Connect with me on social media or send me your contact info</h5>
        <Grid container className="social-media">
         <IconButton ><a href="https://www.linkedin.com/in/lambzachary/" target="_blank"><FaLinkedinIn/></a></IconButton>
         <IconButton ><a href="https://github.com/ZachLamb" target="_blank"><FaGithub/></a></IconButton>
         <IconButton ><a href="https://dev.to/zachlamb" target="_blank"><FaDev/></a></IconButton>
         
        </Grid>
      </Grid>
      <Grid item>
      <Paper className="contact-card">
      <form
        name="contact"
        method="post" 
        netlify-honeypot="bot-field" 
        data-netlify="true" 
        data-netlify-recaptcha="true"
        action="/thanks"
        >
        <input type="hidden" name="form-name" value="contact"/>
        <TextField
          id="outlined-secondary"
          label="Email"
          variant="outlined"
          color="secondary"
          name="email"
          type="input"
          autoFocus
        />
        <TextField
          id="outlined-secondary"
          label="Name"
          variant="outlined"
          color="secondary"
          name="name"
          type="input"
        />
        <TextField
          id="outlined-secondary"
          label="Message"
          variant="outlined"
          color="secondary"
          name="message"
          type="input"
          fullWidth
        />
        <Button color="primary" type="submit">Send email to Zach</Button>
      </form>
      </Paper>
      </Grid>
    </Grid>
  </Layout>
);

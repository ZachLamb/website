import React from "react";
import { Link } from "gatsby";
import Avatar from "@material-ui/core/Avatar";
import Img from "gatsby-image"
import { graphql } from "gatsby";

import "../styles/main.scss";

export default ({ data }) => (
  <div>
     <Img fixed={data.file.childImageSharp.fluid} />
  </div>
);

export const query = graphql`
  query {
    file(relativePath: { eq: "zachlamb.jpg" }) {
      childImageSharp {
        fluid() {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }`


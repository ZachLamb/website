module.exports = {
  plugins: [
    `gatsby-plugin-sass`,
    `gatsby-plugin-material-ui`,
    `gatsby-transformer-sharp`, 
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
  siteMetadata: {
    title: "Zach Lamb",
    titleTemplate: "%s · Front-End Dev and user advocate",
    description:
      "Zach Lamb is a Seattle based front-end dev with UX design skills, accesibility skills, UX Design skills, and occassionally dabbles in the backend",
    url: "https://www.zachlamb.io", // No trailing slash allowed!
    image: "/images/zachlamb.jpg", // Path to your image you placed in the 'static' folder
    twitterUsername: "@zachlambchops",
  },
};
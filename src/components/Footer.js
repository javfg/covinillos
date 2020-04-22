import React from 'react';
import { makeStyles, Link, Button } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';


const useStyles = makeStyles(theme => ({
  footer: {
    color: theme.palette.text.primary.main,
    backgroundColor: 'lightgrey',
    bottom: 0,
    boxShadow: `
      0px 2px 4px -1px rgba(0,0,0,0.2),
      0px 4px 5px 0px rgba(0,0,0,0.14),
      0px 1px 10px 0px rgba(0,0,0,0.12)
    `,
    display: 'flex',
    justifyContent: 'space-between',
    padding: '.25rem .5rem',
    position: 'fixed',

    width: '100%',
    zIndex: 4,
  },
  footerp: { display: 'block', fontSize: '.75rem', fontWeight: 100 },
  icon: { color: theme.palette.primary.main, fontSize: '.9rem'},
  link: { color: theme.palette.primary.main, fontSize: '.75rem' },
}));


function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <span className={classes.footerp}>
        Created to teach myself how to use{' '}

        <Link
          href="https://d3js.org/"
          target="blank"
          className={classes.link}
        >
          d3.js
        </Link>

        , using data provided by{' '}

        <Link
          href="https://github.com/CSSEGISandData/COVID-19"
          target="blank"
          className={classes.link}
        >
          Johns Hopkins CSSE.
        </Link>

      </span>

      <span className={classes.footerp}>
        <Link
          className={classes.link}
          href="https://github.com/javfg/covinillos"
          target="blank"
        >
          <GitHubIcon className={classes.icon} /> Report an issue or take a look at the code
        </Link>
        {' '}|{' '}
        <Link
          href="https://github.com/javfg/covinillos/LICENSE?raw=true"
          target="blank"
          className={classes.link}
        >
          License
        </Link>
      </span>
    </div>
  );
}


export default Footer;

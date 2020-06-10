import Cookies from 'universal-cookie';
import React, { useState, useEffect } from 'react';
import { Button, Snackbar } from '@material-ui/core';


function CookieConsent() {
  const cookies = new Cookies();
  const cookieConsentCookie = cookies.get('cookie-consent');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setOpen(!cookieConsentCookie);
    }, 1000);
  }, []);

  const handleClickClose = () => {
    cookies.set('cookie-consent', '1', { maxAge: 2592000 });
    setOpen(false);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      message={'This site uses cookies for analytics, if you continue using it\
                you are ok with that.'}
      action={
        <Button
          color="secondary"
          size="small"
          onClick={handleClickClose}
        >
          All righty
        </Button>
      }
    />
  );
}


export default CookieConsent;

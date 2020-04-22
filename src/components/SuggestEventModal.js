import React, { useState } from 'react';
import {
  Modal,
  makeStyles,
  Typography,
  TextField,
  Paper,
  Button,
  Grid,
  Box
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countryLabel } from '../utils/utils';


const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 'none',
  },
  field: { width: '100%' },
}));


function SuggestEventModal({ countries, colorMap, handleSendEventSuggestion, onClose, open }) {
  const [country, setCountry] = useState(null);
  const [countryError, setCountryError] = useState(false);
  const [date, setDate] = React.useState('');
  const [dateError, setDateError] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [descriptionError, setDescriptionError] = React.useState(false);
  const [reference, setReference] = React.useState('');
  const [referenceError, setReferenceError] = React.useState(false);

  const handleChangeCountry = (_, v) => {
    setCountryError(false); setCountry(v);
  };
  const handleChangeDate = e => {
    setDateError(false); setDate(e.target.value);
  };
  const handleChangeDescription = e => {
    setDescriptionError(false), setDescription(e.target.value);
  };
  const handleChangeReference = e => {
    setReferenceError(false); setReference(e.target.value);
  };

  const handleClickSend = () => {
    if (validate()) { handleSendEventSuggestion(country, date, description, reference); };
  };


  const validate = () => {
    if (!country) setCountryError(true);
    if (!date) setDateError(true);
    if (!description) setDescriptionError(true);
    if (!reference) setReferenceError(true);

    return country && date && description && reference;
  };

  const classes = useStyles();


  return (
    <Modal open={open} onClose={onClose}>
      <Paper className={classes.paper}>
        <Typography variant="h5">Suggest a new event</Typography>
        <p>All fields are required.</p>

        <form name="suggest-event" method="post">
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Autocomplete
                name="suggest-event-country"
                autoHighlight
                disableClearable
                options={countries}
                onChange={handleChangeCountry}
                value={country}
                renderOption={c => <span style={{color: colorMap[c]}}>{countryLabel(c)}</span>}
                renderInput={params =>
                  <TextField
                    {...params}
                    label="Choose a country"
                    inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
                    error={countryError}
                  />
                }
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                name="suggest-event-date"
                className={classes.field}
                error={dateError}
                label="Date of event"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={handleChangeDate}
                value={date}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="suggest-event-description"
                className={classes.field}
                label="Description"
                error={descriptionError}
                onChange={handleChangeDescription}
                value={description}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="suggest-event-reference"
                className={classes.field}
                label="Reference"
                error={referenceError}
                onChange={handleChangeReference}
                value={reference}
              />
            </Grid>

            <Grid item xs={12}>
              <Box textAlign="right">
                <Button
                  color="primary"
                  onClick={handleClickSend}
                  variant="contained"
                  type="submit"
                >
                  Send
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Modal>
  );
}


export default SuggestEventModal;

import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import SettingsAccordeon from './SettingsAccordeon';

export const SettingDialog = (props)=> {
  const { onClose, open } = props;
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth onClose={handleClose} open={open} PaperProps={{style:{backgroundColor:'#151f27'}}}>
      <DialogTitle sx={{backgroundColor:'#092129', color:'white'}}>Paramètres</DialogTitle>
      <SettingsAccordeon localSettings={props.localSettings} callbacks={props.callbacks}/>
    </Dialog>
  );
}

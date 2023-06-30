import React from 'react';
import { useEffect, useContext, useState } from 'react';
import Context from 'store/context';
import { makeStyles } from '@material-ui/core/styles';
import CardView from 'components/cardView';
import GlobalContext from 'store/context';

const DataList = ({ description, secret }) => {
  const { globalState, globalDispatch } = useContext(GlobalContext);

  useEffect(() => {
    if (!globalState.selectedSecret || globalState.secretIndex === -1) {
      globalDispatch({ type: 'SELECTED_SECRET', payload: 'Your Secret' });
    }
    if (!globalState.selectedDes || globalState.secretIndex === -1) {
      globalDispatch({ type: 'SELECTED_DES', payload: 'View your secret here!' });
    }
  }, [globalState.teamIndex, globalState.secretIndex]);

  return <CardView description={description} secret={secret} />;
};

export default DataList;

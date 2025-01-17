/* eslint-disable @typescript-eslint/indent */
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSpace } from '../../../../pages/tribe/[id]/space/[bid]';
import { useGlobal } from '../../../context/globalContext';
import { DistributionInfo } from '../../../types';
import { PrimaryButton } from '../../elements/styledComponents';
import usePaymentGateway from '../../../hooks/usePaymentGateway';

type Props = {
  handleNextStep: Function;
  handleClose: Function;
  chainId: string;
  distributionInfo: DistributionInfo;
  handleStatusUpdate: Function;
};

function BatchPay({
  handleNextStep,
  handleClose,
  chainId,
  distributionInfo,
  handleStatusUpdate,
}: Props) {
  const { space } = useSpace();
  const { state } = useGlobal();
  const { registry } = state;
  const { batchPay, isLoading } = usePaymentGateway(
    handleStatusUpdate,
    handleNextStep
  );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        marginTop: '16px',
      }}
    >
      <>
        <Box>
          {distributionInfo.contributors.map(
            (contributor: string, index: number) => (
              <Grid
                container
                spacing={1}
                key={contributor}
                sx={{ display: 'flex' }}
                margin="8px"
              >
                <Grid item xs={8}>
                  <Box sx={{ display: 'flex' }}>
                    <Avatar
                      alt=""
                      src={
                        space.memberDetails[contributor]?.profilePicture
                          ? space.memberDetails[contributor].profilePicture._url
                          : `https://www.gravatar.com/avatar/${space.memberDetails[contributor]?.username}?d=identicon&s=32`
                      }
                      sx={{ height: 30, width: 30 }}
                    />
                    <Typography color="text.primary" marginLeft="20px">
                      {space.memberDetails[contributor]?.username}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="text.primary" marginLeft="20px">
                    {distributionInfo.tokenValues[index]?.toFixed(3)}{' '}
                    {distributionInfo.type === 'tokens'
                      ? registry[chainId].tokens[
                          distributionInfo.tokenAddresses[index]
                        ].symbol
                      : registry[chainId].nativeCurrency}
                  </Typography>
                </Grid>
              </Grid>
            )
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} />
      </>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, marginTop: 8 }}>
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => handleClose()}
          sx={{ mr: 1, color: '#f45151' }}
          id="bCancel"
        >
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <PrimaryButton
          data-testid="bBatchPayModalButton"
          loading={isLoading}
          sx={{ borderRadius: '3px' }}
          onClick={() => {
            batchPay(window.ethereum.networkVersion, distributionInfo);
          }}
          variant="outlined"
          id="bApprove"
          color="secondary"
        >
          Pay
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default BatchPay;

import { Card, Grid, CardHeader, Typography, CardContent } from '@mui/material';

import AccountChangeEmail from './account-change-email';
import AccountChangePassword from './account-change-password';

export default function ManageAccountSecurity() {
  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Security
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Change Email" />
            <CardContent>
              <AccountChangeEmail />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Change Password" />
            <CardContent>
              <AccountChangePassword />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

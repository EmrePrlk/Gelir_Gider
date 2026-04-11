import { paths } from 'src/config/paths';
import { Status } from 'src/definitions';
import StatusGuard from 'src/guards/auth/status-guard';
import SelectRoleView from 'src/app/(app)/landing/_components/select-role';

export const metadata = {
  title: 'Junius App | Landing page',
};

function SelectRolePage() {
  return (
    <StatusGuard
      allowedStatuses={[Status.INACTIVE]}
      redirectPath={paths.landing.approval}
    >
      <SelectRoleView />
    </StatusGuard>
  );
}

export default SelectRolePage;

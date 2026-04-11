import { usePathname } from 'next/navigation';

import { useDefinitionStore } from 'src/stores/definition-store';

export default function useLandingItem() {
  const [roleGroups] = useDefinitionStore(state => [state.roleGroups]);
  const pathname = usePathname();

  const titleKey = pathname?.split('/').pop() || '';
  const landingItem = roleGroups.find(item => item.link.includes(titleKey));

  return landingItem;
}

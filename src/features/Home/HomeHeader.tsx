import { Flexbox } from '@lobehub/ui';
import { Text } from '@lobehub/ui/base-ui';
import { createStaticStyles } from 'antd-style';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';
import { authSelectors, userProfileSelectors } from '@/store/user/slices/auth/selectors';

import AgentSelect from './AgentSelect';
import { getGreetingKey } from './greeting';

const styles = createStaticStyles(({ css }) => ({
  root: css`
    /* Unbroken names must stay inside the start-aligned header's text lane. */
    max-width: 100%;
  `,
  greeting: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    margin: 0;

    font-size: 22px;
    line-height: 1.4;
    letter-spacing: -0.01em;
  `,
  toolbar: css`
    width: 100%;
    min-width: 0;
    min-height: 48px;
  `,
}));

interface HomeHeaderProps {
  centered?: boolean;
}

const HomeHeader = memo<HomeHeaderProps>(({ centered }) => {
  const { t, i18n } = useTranslation('home');
  const displayName = useUserStore(userProfileSelectors.displayUserName);
  const isLogin = useUserStore(authSelectors.isLogin);

  const now = new Date();
  const greetingKey = getGreetingKey(now.getHours());
  // Localized "today" (e.g. "10月9日"), threaded into the greeting template.
  const date = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long' }).format(
    now,
  );
  const greeting = isLogin
    ? t(`dashboard.greeting.${greetingKey}`, { date, name: displayName })
    : t(`dashboard.greeting.${greetingKey}Guest`, { date });

  return (
    // Minimal mode keeps the full layout's stacking order — the switcher names
    // who speaks, the greeting answers below — but drops the toolbar chrome and
    // its 48px lane, so the pair reads as one compact block flush with the
    // composer. The layout's lift math (MINIMAL_LIFT) counts on these heights.
    <Flexbox className={styles.root} gap={centered ? 8 : 16} justify={'center'}>
      {centered ? (
        <AgentSelect />
      ) : (
        <Flexbox horizontal align={'center'} className={styles.toolbar}>
          <AgentSelect />
        </Flexbox>
      )}
      <Text as={'h1'} className={styles.greeting} weight={600}>
        {greeting}
      </Text>
    </Flexbox>
  );
});

export default HomeHeader;

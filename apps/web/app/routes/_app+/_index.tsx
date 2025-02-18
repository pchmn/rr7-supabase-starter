import { Button } from '@rr7-supabase-starter/ui/button';
import { Card, CardContent } from '@rr7-supabase-starter/ui/card';
import { Flex } from '@rr7-supabase-starter/ui/flex';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useCurrentUser } from '~/modules/auth/useCurrentUser';

export function meta() {
  return [
    { title: 'rr7-supabase-starter' },
    { name: 'description', content: 'Welcome to rr7-supabase-starter!' },
  ];
}

export default function Home() {
  const currentUser = useCurrentUser();

  const { t } = useTranslation();

  return (
    <Flex direction='col' gap='md' flex='1'>
      {currentUser.is_anonymous && (
        <Flex justify='center' align='center' flex='1'>
          <Card className='shadow-none'>
            <CardContent className='p-2 pl-3 inline-flex gap-2 items-center'>
              <p className='text-xs text-muted-foreground'>
                {t('index.dontLoseYourProgress')}
              </p>
              <Link to='/sign-in'>
                <Button size='xs' variant='ghost'>
                  {t('index.signIn')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Flex>
      )}
    </Flex>
  );
}

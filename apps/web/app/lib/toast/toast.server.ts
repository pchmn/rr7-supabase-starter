import { createCookieSessionStorage, redirect } from 'react-router';
import invariant from 'tiny-invariant';
import type { I18nKey } from '~/i18n/i18nConfig';
import { combineHeaders } from '../utils/combineHeaders.server';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}${'.'}${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export const TOAST_KEY = 'toast';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  type: ToastType;
  message: NestedKeyOf<I18nKey>;
  description?: NestedKeyOf<I18nKey>;
}

invariant(process.env.SESSION_SECRET, 'SESSION_SECRET must be defined');
const { getSession: getSessionInternal, commitSession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      secrets: [process.env.SESSION_SECRET],
      name: '__toast',
      sameSite: 'lax',
    },
  });

async function getSession(request?: Request) {
  return getSessionInternal(request?.headers.get('Cookie'));
}

async function createToast(toast: Toast) {
  const session = await getSession();

  session.flash(TOAST_KEY, toast);

  return new Headers({
    'Set-Cookie': await commitSession(session),
  });
}

export async function redirectWithToast(
  url: string,
  toast: Toast,
  init?: ResponseInit,
) {
  return redirect(url, {
    ...init,
    headers: combineHeaders(init?.headers, await createToast(toast)),
  });
}

export async function getToast(request: Request) {
  const session = await getSession(request);

  const toast = session.get(TOAST_KEY) as Toast | undefined;

  return {
    toast,
    headers: toast
      ? new Headers({
          'Set-Cookie': await commitSession(session),
        })
      : undefined,
  };
}

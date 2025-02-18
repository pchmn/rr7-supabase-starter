export type PropsWithRef<Props, Elt = HTMLElement> = Props & {
  ref?: React.RefObject<Elt>;
};

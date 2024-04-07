import { LinkProps, Link as RouterLink } from "react-router-dom";

const Link = (props: LinkProps) => {
  const { children, className, ...rest } = props;

  return (
    <RouterLink
      {...rest}
      className={`text-blue-500 underline underline-offset-2 ${className}`}
    >
      {children}
    </RouterLink>
  );
};

export default Link;

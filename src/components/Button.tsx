import { KeyTextField } from "@prismicio/client";
import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import clsx from "clsx";
import { MdArrowOutward } from "react-icons/md";

type Props = {
  linkField: LinkField;
  label: KeyTextField;
  showIcon?: boolean;
  className?: string;
};

const Button = ({ linkField, label, showIcon = false, className }: Props) => {
  return (
    <PrismicNextLink
      field={linkField}
      className={clsx(
        "group relative flex w-fit items-center justify-center overflow-hidden rounded-md border-2 border-slate-900 bg-slate-50 px-4 py-2 font-bold transition-transform ease-out hover:scale-105 text-slate-800",
        className,
      )}
    >
      <span className="absolute inset-0 z-0 h-full translate-y-9 bg-yellow-300 transition-transform duration-300 ease-in-out group-hover:translate-y-0"></span>

      <span className="relative flex items-center justify-center gap-2">
        {label} {showIcon && <MdArrowOutward className="inline-block" />}
      </span>
    </PrismicNextLink>
  );
};

export default Button;

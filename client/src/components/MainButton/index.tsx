import { ButtonHTMLAttributes, ReactNode } from "react";
import { ReactSVG } from "react-svg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const Button = ({
  children,
  variant,
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "font-JetBrainsMono rounded-xl transition-all duration-200 ease-in-out flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20",
    secondary:
      "bg-thrid text-primary hover:bg-thrid/90 hover:shadow-lg hover:shadow-thrid/20",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-primary bg-glass hover:bg-primary/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const width = fullWidth ? "w-full" : "w-fit";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${
        sizes[size]
      } ${width} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ReactSVG
          src="/svgs/loading.svg"
          className="[&>div>svg]:max-md:size-5  [&>div>svg]:size-6 animate-spin [&_*]:stroke-primary"
        />
      ) : (
        <>
          {icon && iconPosition === "left" && (
            <ReactSVG
              src={icon}
              className="[&>div>svg]:max-md:size-5  [&>div>svg]:size-6 [&_*]:stroke-current"
            />
          )}
          {children}
          {icon && iconPosition === "right" && (
            <ReactSVG
              src={icon}
              className="[&>div>svg]:max-md:size-5  [&>div>svg]:size-6 [&_*]:stroke-current"
            />
          )}
        </>
      )}
    </button>
  );
};

export default Button;

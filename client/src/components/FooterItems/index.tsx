import Button from "../MainButton";

const FooterItems = ({
  value,
  iconSrc,
}: {
  value: string;
  iconSrc: string;
}) => {
  return (
    <Button tabIndex={-1} variant={undefined} className="footer-theme-control [&_*]:stroke-primary bg-thrid" size="md" icon={iconSrc} iconPosition="left">
      <p className="text-primary">{value}</p>
    </Button>
  );
};

export default FooterItems;

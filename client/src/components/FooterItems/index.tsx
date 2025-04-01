import Button from "../MainButton";

const FooterItems = ({
  value,
  iconSrc,
}: {
  value: string;
  iconSrc: string;
}) => {
  return (
    <Button tabIndex={-1} variant={undefined} className="[&_*]:stroke-primary hover:!bg-thrid" size="md" icon={iconSrc} iconPosition="left">
      <p className="text-primary">{value}</p>
    </Button>
  );
};

export default FooterItems;

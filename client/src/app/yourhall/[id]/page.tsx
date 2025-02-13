import UserProfileCard from "@/components/UserProfile";

interface Props {
  params: { id: string };
}

export default function UserPage({ params }: Props) {
  const { id } = params; // Get the dynamic route parameter
  console.log(id);
  return (
    <div className="flex pt-40 w-10/12 gap-10 mx-auto flex-col items-center">
      <UserProfileCard username={id} />
    </div>
  );
}

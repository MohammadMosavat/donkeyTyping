import UserProfileCard from "@/components/UserProfile";
import WpmRecords from "@/components/WpmRecord";
import { ReactNode } from "react";

interface Props {
  params: { id: string };
  children: ReactNode;
}

export default function UserPage({ children, params }: Props) {
  return (
    <div className="flex pt-40 w-10/12 gap-10 mx-auto mb-20 flex-col items-center">
      <UserProfileCard username={params.id} />
      {children}
    </div>
  );
}

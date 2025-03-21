export default interface UserProfileCardProps {
  username: string;
  email: string;
  location: string;
  joinedAt: string;
}

export interface WpmRecord {
  username: string;
  time: number;
  wpm: number;
  correct_char: number;
  incorrect_char: number;
  date: string;
  language: string;
}

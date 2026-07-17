export default interface UserProfileCardProps {
  id: string;
  username: string;
  email: string;
  location: string;
  joinedAt: string;
}


export interface WpmRecord {
  id: string;
  username: string;
  time: number;
  word: string | number;
  wpm: number;
  correct_char: number;
  incorrect_char: number;
  date: string;
  language: string;
}

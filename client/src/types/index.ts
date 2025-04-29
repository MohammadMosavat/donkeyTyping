export default interface UserProfileCardProps {
  _id: string;
  username: string;
  email: string;
  location: string;
  joinedAt: string;
}


export interface WpmRecord {
  username: string;
  time: number;
  word: number;
  wpm: number;
  correct_char: number;
  incorrect_char: number;
  date: string;
  language: string;
}

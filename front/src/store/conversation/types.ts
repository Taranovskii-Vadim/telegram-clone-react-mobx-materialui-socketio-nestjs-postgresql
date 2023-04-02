import { Base, CommonChat, CommonMessage } from '../types';

export type Message = CommonMessage & {
  error: string;
  isLoading: boolean;
};

export interface Store extends Base<CommonChat> {
  currentText: string;
  messages: Message[];

  setCurrentText: (value: string) => void;
  createMessage: () => Promise<void>;
  setMessage: (id: number, value: Partial<Message>) => void;
}
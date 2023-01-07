import { action, makeObservable, observable } from 'mobx';

import { api } from '../../api';
import getChat from '../../api/getChat';
import getMessages from '../../api/getMessages';
import postMessage from '../../api/postMessage';

import chats from '../chats';
import { formatChatDate } from '../../utils';

import { Message, MessagePayload, Chat } from './types';

class ChatStore {
  data: Chat | undefined = undefined;

  isLoading = true;

  isFormLoading = false;

  isUserOnline = false;

  messages: Message[] = [];

  constructor() {
    makeObservable(this, {
      messages: observable,
      isLoading: observable,
      isFormLoading: observable,
      isUserOnline: observable,

      setMessage: action,
      setIsLoading: action,
      setIsUserOnline: action,
      setIsFormLoading: action,
    });
  }

  setIsUserOnline = (value: boolean): void => {
    this.isUserOnline = value;
  };

  setIsLoading = (value: boolean): void => {
    this.isLoading = value;
  };

  setMessage = (message: Message): void => {
    this.messages.push(message);
  };

  setIsFormLoading = (value: boolean): void => {
    this.isFormLoading = value;
  };

  addMessage = async (senderId: number, text: string): Promise<number | undefined> => {
    if (this.data) {
      const chatId = this.data.id;
      const payload: MessagePayload = { senderId, chatId, text };
      // TODO create uniq message id in front instead of 100500
      const id = 100500;
      this.setMessage({ id, ...payload });

      await api(postMessage, payload);

      chats.setLastMessage(chatId, { text, senderId, createdAt: formatChatDate(new Date()) });

      return id;
    }
  };

  fetchData = async (chatId: number): Promise<void> => {
    try {
      this.setIsLoading(true);

      const result = await api(getChat, undefined, chatId);
      // TODO here we get last 10 messages after that we must load them by scroll
      const messages = await api(getMessages, undefined, chatId);

      this.data = result;
      this.messages = messages;
    } finally {
      this.setIsLoading(false);
    }
  };
}

export default ChatStore;

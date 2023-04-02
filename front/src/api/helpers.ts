import { formatDate } from 'src/utils';
import { User } from 'src/store/types';
import { Message } from 'src/store/conversation/types';

import { CommonUserDTO, CommonMessageDTO } from './types';

export const mapUserDTO = ({ id, name, lastname }: CommonUserDTO): User => ({
  id,
  fullname: `${lastname} ${name}`,
});

export const mapMessageDTO = ({ createdAt, sender, text, id }: CommonMessageDTO): Message => ({
  id,
  text,
  error: '',
  isLoading: false,
  sender: mapUserDTO(sender),
  createdAt: formatDate(createdAt),
});

import { model, Schema } from 'mongoose';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => v.length >= 2 && v.length <= 30,
    },
  },
  about: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => v.length >= 2 && v.length <= 200,
    },
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('user', userSchema);

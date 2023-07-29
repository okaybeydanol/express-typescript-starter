import { User, UserResponse } from '@interfaces/user.interface';

/**
 * Transform the source to any json by removing unwanted elements.
 */
const userJson = async (userData: User): Promise<UserResponse> => {
  return { _id: userData._id, email: userData.email };
};

const userResource = {
  userJson,
};

export default userResource;

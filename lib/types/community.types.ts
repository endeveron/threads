export type TCreateCommunityParams = {
  id: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  createdById: string;
};

export type TUpdateCommunityParams = {
  id: string;
  name: string;
  username: string;
  image: string;
};

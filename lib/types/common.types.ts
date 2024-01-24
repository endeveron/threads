export type WithChildren<T = {}> = T & { children?: React.ReactNode };

export type TRequestCardProps = {
  userId: string;
  authUserId: string;
  name: string;
  username: string;
  image: string;
  email: string;
  communityId: string;
  isCommunityCreator: boolean;
};

export type TJoinComunityData =
  | {
      communityId: string;
      userObjectId: string;
    }
  | undefined;

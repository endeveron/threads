import { ObjectId } from 'mongoose';

import ReplyCard from '@/components/cards/ReplyCard';
import { fetchUserReplies } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';

type TUserRepliesProps = {
  userId: string;
  userObjectId: string;
  replyIdList: ObjectId[];
  className?: string;
};

const UserReplies = async ({
  userId,
  userObjectId,
  replyIdList,
  className,
}: TUserRepliesProps) => {
  const replies = await fetchUserReplies({ replyIdList });

  return replies?.length ? (
    <section className={cn('user-replies flex flex-col gap-10', className)}>
      {replies.map((reply) => (
        <ReplyCard
          _id={reply._id}
          author={reply.author}
          community={reply.community}
          text={reply.text}
          likes={reply.likes}
          parent={reply.parent}
          createdAt={reply.createdAt}
          userId={userId}
          userObjectId={userObjectId}
          key={reply._id.toString()}
        />
      ))}
    </section>
  ) : (
    <p className="no-result mt-9">No replies yet</p>
  );
};

export default UserReplies;

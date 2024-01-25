// import { TActivity } from '@/lib/types/activity.types';
import Image from 'next/image';
import Link from 'next/link';

type TActivityCardProps = {
  activity: any;
};

const ActivityCard = ({ activity }: TActivityCardProps) => {
  return (
    <Link href={`/thread/${activity.parentId}`}>
      <article className="activity-card paper">
        <Image
          src={activity.author.image}
          alt="user avatar"
          width={30}
          height={30}
          className="rounded-full object-cover"
        />
        <p className="text-small-regular">
          <span className="text-main font-bold">{activity.author.name}</span>
          <span className="text-secondary ml-2">replied to your thread</span>
        </p>
      </article>
    </Link>
  );
};

export default ActivityCard;

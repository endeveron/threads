import { fetchSuggestedCommunities } from '@/lib/actions/community.actions';
import Image from 'next/image';
import Link from 'next/link';

type TSuggestedCommunitiesProps = {};

const SuggestedCommunities = async (props: TSuggestedCommunitiesProps) => {
  const communities = await fetchSuggestedCommunities({ number: 10 });

  return (
    communities?.length && (
      <div className="suggested-communities flex flex-col gap-6">
        {communities.map((community) => (
          <div className="community-item" key={community.id}>
            <Link href={`/community/${community.id}`}>
              <Image
                src={community.image}
                alt="community_logo"
                height={48}
                width={48}
                className="rounded-full object-cover"
              />

              <div>
                <p className="text-small-medium text-main">{community.name}</p>
                <p className="text-small-medium text-tertiary">
                  @{community.username}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
  );
};

export default SuggestedCommunities;

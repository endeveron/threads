import { cn } from '@/lib/utils';

type TSpinnerProps = {
  className?: string;
};

const Spinner = ({ className }: TSpinnerProps) => {
  return (
    <div className={cn('flex w-full justify-center', className)}>
      <span className="spinner"></span>
    </div>
  );
};

export default Spinner;

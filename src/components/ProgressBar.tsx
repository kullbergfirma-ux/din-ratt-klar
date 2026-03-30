interface Props {
  current: number;
  total: number;
  labels?: string[];
}

const ProgressBar = ({ current, total, labels }: Props) => {
  const percentage = (current / total) * 100;
  const defaultLabels = ['Kategori', 'Frågor', 'Resultat'];
  const displayLabels = labels || defaultLabels;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {displayLabels.map((label, i) => (
          <span
            key={label}
            className={`text-xs font-medium transition-colors ${
              i < current ? 'text-primary' : i === current ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

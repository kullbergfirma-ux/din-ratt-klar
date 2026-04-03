interface Props {
  current: number;
  total: number;
  labels?: string[];
}

const ProgressBar = ({ current, total }: Props) => {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ height: 3, background: '#E8ECF0', borderRadius: 4, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: '#1B4F8A',
            borderRadius: 4,
            width: `${percentage}%`,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

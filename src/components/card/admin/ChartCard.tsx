// Chart card component
const ChartCard = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        {children}
    </div>
);

export default ChartCard;

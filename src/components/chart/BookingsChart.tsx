import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";

interface BookingsChartProps {
    data: Array<{ date: string; count: number }>;
}

const BookingsChart: React.FC<BookingsChartProps> = ({ data }) => {
    // Format data untuk chart
    const chartData = data.map((item) => ({
        date: format(parseISO(item.date), "dd MMM", { locale: localeId }),
        count: item.count,
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={8} />
                <YAxis
                    tick={{ fontSize: 12 }}
                    allowDecimals={false}
                    tickMargin={8}
                />
                <Tooltip
                    formatter={(value) => [`${value} reservasi`, "Jumlah"]}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #f0f0f0",
                        borderRadius: "4px",
                        padding: "8px",
                    }}
                />
                <Bar
                    dataKey="count"
                    name="Reservasi"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BookingsChart;

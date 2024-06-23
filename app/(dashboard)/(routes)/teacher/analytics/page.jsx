import { getAnalytics } from "@/actions/get-analytics";
import { Chart } from "@/components/chart";
import { DataCard } from "@/components/data-card";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const AnalyticsPage = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const {data, totalRevenue, totalSales} = await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    value={totalRevenue}
                    label="Total Revenue"
                    shouldFormat
                />
                <DataCard
                    value={totalSales}
                    label="Total Sales"
                />
            </div>

            <Chart
                data={data}
            />
        </div>
    );
};

export default AnalyticsPage;

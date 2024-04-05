import { Card } from '@/app/dashboard/cards';
import RevenueChart from '@/app/dashboard/revenue-chart';
import LatestInvoices from '@/app/dashboard/latest-invoices';
import { lusitana } from '@/app/fonts';
import {fetchLatestInvoices,fetchCardData} from "@/app/lib/data";
import {Suspense} from "react";
import { RevenueChartSkeleton} from "@/app/skeletons";
import {Metadata} from "next";

export default async function Page() {

    const latestInvoices=await fetchLatestInvoices();
    const {
        numberOfInvoices,
        numberOfCustomers,
        totalPaidInvoices,
        totalPendingInvoices,
    } = await fetchCardData();

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {<Card title="Collected" value={totalPaidInvoices} type="collected" /> }
                {<Card title="Pending" value={totalPendingInvoices} type="pending" /> }
                { <Card title="Total Invoices" value={numberOfInvoices} type="invoices" /> }
                { <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        /> }
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton/>}>
                    <RevenueChart/>
                </Suspense>
                 <LatestInvoices latestInvoices={latestInvoices} />
            </div>
        </main>
    );
}
export const metadata:Metadata={
    title:"Dashboard"
}
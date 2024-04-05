import Pagination from "@/app/dashboard/invoices/pagination";
import Search from '@/app/search';
import Table from "@/app/dashboard/invoices/table";
import { CreateInvoice } from "@/app/dashboard/invoices/buttons";
import { lusitana } from '@/app/fonts';
import { InvoicesTableSkeleton } from '@/app/skeletons';
import { Suspense } from 'react';
import {fetchInvoicesPages} from "@/app/lib/data";
import {Metadata} from "next";

export default async function Page(
    {
        searchParams,
    }: {
        searchParams?: {
            query?: string;
            page?: string;
        };
    }
) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages=await  fetchInvoicesPages(query);
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search invoices..." />
                <CreateInvoice />
            </div>
            { <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> }
            <div className="mt-5 flex w-full justify-center">{<Pagination totalPages={totalPages} /> }
            </div>
        </div>
    );
}
export const metadata:Metadata={
    title:"Invoice"
}
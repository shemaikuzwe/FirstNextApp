import Form from '@/app/dashboard/invoices/edit-form';
import Breadcrumbs from '@/app/dashboard/invoices/breadcrumbs';
import { fetchCustomers,fetchInvoiceById } from '@/app/lib/data';

export default async function Page({ params }: { params:{ id: string } } ) {
    const id=params.id;
    const [invoice,customers]=await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers()
    ]);
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: '/dashboard/invoices' },
                    {
                        label: 'Edit Invoice',
                        href: `/dashboard/invoices/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form invoice={invoice} customers={customers} />
        </main>
    );
}
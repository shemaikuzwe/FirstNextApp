"use server"
import {z} from "zod";
import {sql} from "@vercel/postgres";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/app/auth";
import { AuthError } from 'next-auth';

const FormSchema=z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error:"please select a customer",
    }),
    amount: z.coerce.number().gt(0,{message:"please Enter amount grater than $0"}),
    status: z.enum(["pending","paid"],{
        invalid_type_error:"please select invoice status"
    }),
    date: z.string()
});
const CreateInvoice=FormSchema.omit({id: true,date: true });
// This is temporary until @types/react-dom is updated
export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState:State,formData :FormData){
  const validate=CreateInvoice.safeParse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status")
  });
  if (!validate.success){
      return{
        errors:validate.error.flatten().fieldErrors,
          message:"Missing fields. failed to create invoice"
      };
  }
  const {customerId,amount,status}=validate.data;
  const amountInCents=amount*100;
  const date=new Date().toISOString().split('T')[0];
  try {
      await sql `insert into invoices(customer_id,amount,status,date)
             values (${customerId},${amountInCents},${status},${date})
  `;
  }catch (error){
      return {
          message:"Failed to create invoice"
      }
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string,formData :FormData){
    const {customerId,amount,status}=UpdateInvoice.parse({
        customerId: formData.get("customerId"),
        amount:formData.get("amount"),
        status:formData.get("status")
    });
    const amountInCent=amount *100;
    await sql `
     UPDATE invoices SET  customer_id=${customerId},amount=${amountInCent},status=${status}
     WHERE id=${id}
   `;
    revalidatePath('/dashboard/invoices');
    redirect("/dashboard/invoices");
}
export async function deleteInvoice(id: string){

    await sql` 
    DELETE FROM invoices where id=${id} `;
    revalidatePath('/dashboard/invoices');
}
//authentication
export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
import { redirect } from 'next/navigation';

export default function notFound(): void {
  // redirect to home page
  redirect('/home');
}

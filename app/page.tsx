import { redirect } from 'next/navigation';

export default function RootPage() {
  // Langsung tendang siapapun yang buka halaman utama ke halaman login resmi
  redirect('/login');
}
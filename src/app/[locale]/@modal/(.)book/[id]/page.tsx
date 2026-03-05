import BookPage from '@/app/[locale]/book/[id]/page';
import Modal from '@/components/modal';

export default function Page({params}: {params: Promise<{id: string}>}) {
  return (
    <Modal>
      <BookPage params={params} />
    </Modal>
  );
}

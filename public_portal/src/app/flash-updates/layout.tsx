import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ताजा खबर - २४ घन्टाको ताजा अपडेट',
  description: 'नैनिकी ताजा खबर र २४ घन्टाको अपडेट। सबै ताजा घटनाहरू यहाँ हेर्नुहोस्।',
};

export default function FlashUpdatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

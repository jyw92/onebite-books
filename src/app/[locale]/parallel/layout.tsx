import Link from 'next/link';

export default function Layout({
  children,
  sidebar,
  feed,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  feed: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex gap-5">
        <Link href={'/parallel'} className="rounded-[2px] border border-b-blue-800 p-2">
          parallel
        </Link>
        <Link href={'/parallel/setting'} className="rounded-[2px] border border-b-blue-800 p-2">
          parallel/setting
        </Link>
      </div>
      <br />
      {sidebar}
      {feed}
      {children}
    </div>
  );
}

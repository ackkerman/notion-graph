export default function NotionRenderer({ html }: { html: string }) {
  return (
    <section className="notion-render">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  )
}
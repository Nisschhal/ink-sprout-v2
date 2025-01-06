export default function ProductRoute({ params }: { params: { id: string } }) {
  return <div>ProductRoute with id {params.id}</div>
}

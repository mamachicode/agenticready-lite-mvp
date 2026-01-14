"use client";

export default function ClientForms({ id }: { id: string }) {
  return (
    <>
      <form method="POST" encType="multipart/form-data" action={`/api/admin/orders/${id}/upload`}>
        <input type="file" name="file" required />
        <button type="submit" className="ml-2 px-3 py-1 bg-black text-white rounded">
          Upload PDF
        </button>
      </form>

      <form method="POST" action={`/api/admin/orders/${id}/fulfill`}>
        <button type="submit" className="px-3 py-1 bg-green-700 text-white rounded">
          Mark Fulfilled
        </button>
      </form>
    </>
  );
}

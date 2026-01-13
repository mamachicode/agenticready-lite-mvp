export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "iad1";
export const fetchCache = "force-no-store";
export const revalidate = 0;

          method="post"
          encType="multipart/form-data"
        >
          <input type="file" name="file" required />
          <button className="ml-2 px-3 py-1 bg-black text-white rounded" type="submit">
            Upload PDF
          </button>
        </form>

        <form action={`/api/admin/orders/${order.id}/fulfill`} method="post">
          <button className="px-3 py-1 bg-green-700 text-white rounded" type="submit">
            Mark Fulfilled
          </button>
        </form>
      </div>
    </div>
  );
}

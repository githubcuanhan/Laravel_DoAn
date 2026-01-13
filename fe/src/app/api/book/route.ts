import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

async function saveFile(folder: string, file: File, fileName: string) {
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(folder, fileName), buffer);
  return `/public/${folder}/${fileName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const bookCode = formData.get("maSach") as string;
    if (!bookCode) return NextResponse.json({ success: false, message: "Chưa có mã sách" }, { status: 400 });

    const images = formData.getAll("images") as File[];
    const qrFile = formData.get("maQR") as File;

    const bookFolder = path.join(process.cwd(), "public", "book-images", bookCode);
    const qrFolder = path.join(process.cwd(), "public", "qr-codes");

    await fs.mkdir(bookFolder, { recursive: true });
    await fs.mkdir(qrFolder, { recursive: true });

    const timestamp = Date.now();
    const uploadedImages: string[] = [];

    for (const img of images) {
      const ext = path.extname(img.name);
      const fileName = `BOOKIMG_${timestamp}${ext}`;
      await saveFile(bookFolder, img, fileName);
      uploadedImages.push(`/book-images/${bookCode}/${fileName}`);
    }

    let qrUrl = "";
    if (qrFile) {
      const qrName = `${bookCode}.png`;
      await saveFile(qrFolder, qrFile, qrName);
      qrUrl = `/qr-codes/${qrName}`;
    }

    return NextResponse.json({ success: true, images: uploadedImages, qrUrl });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

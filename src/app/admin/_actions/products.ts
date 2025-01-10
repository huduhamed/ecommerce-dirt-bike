"use server";

import db from "@/db/db";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";

// create schemas for file & image
const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  description: z.string().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

// add product action
export async function AddProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // save files to file-system before downloads
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  // save file
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  // for image
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  // save image
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      priceInCents: data.priceInCents,
      description: data.description,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

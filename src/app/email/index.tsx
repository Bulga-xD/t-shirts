import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import PurchaseReceiptEmail from "./purchase-receipt";
import { Order } from "@/types";
import { getColors } from "@/lib/actions/color.actions";

export const sendOrderEmail = async (order: Order) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_SERVER_USERNAME,
      pass: process.env.SMTP_SERVER_PASSWORD,
    },
  });

  const colors = await getColors();

  const html = await render(
    <PurchaseReceiptEmail order={order} colors={colors} />
  );

  const emails = [process.env.ADMIN_MAIL!, order.user.email];

  const options = {
    from: process.env.ADMIN_MAIL!,
    to: emails,
    subject: `Поръчка #${order.id}`,
    html,
  };

  await transporter.sendMail(options);
};

import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import PurchaseReceiptEmail from "./purchase-receipt";
import { Order } from "@/types";

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

  const html = await render(<PurchaseReceiptEmail order={order} />);

  const emails = ["ch.tonchev94@gmail.com", order.user.email];

  const options = {
    from: "chokobg@gmail.com",
    to: emails,
    subject: `Поръчка #${order.id}`,
    html,
  };

  await transporter.sendMail(options);
};

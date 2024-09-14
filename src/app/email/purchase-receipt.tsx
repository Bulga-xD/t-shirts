import { formatPrice } from "@/lib/utils";
import { Order } from "@/types";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type OrderInformationProps = {
  order: Order;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function PurchaseReceiptEmail({ order }: OrderInformationProps) {
  order.orderItems.map((item) => {
    console.log(item.image);
  });

  const items = order.orderItems?.length ? order.orderItems : [];

  return (
    <Html>
      <Preview>Вижте разписката за поръчка</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Разписка на поръчката</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Поръчката &#8470;
                  </Text>
                  <Text className="mt-0 mr-4">{order.id}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Закупено на
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 text-gray-500 whitespace-nowrap text-nowrap mr-4">
                    Платена цена
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatPrice(Number(order.totalPrice), {
                      currency: "BGN",
                      IntlFormat: "bg-BG",
                    })}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {items.map((item) => (
                <Row key={item.productId} className="flex items-start">
                  <Column className="w-20">
                    <Img
                      width="80"
                      alt={item.name}
                      className="rounded"
                      src={
                        item.image.startsWith("/")
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : item.image
                      }
                    />
                  </Column>
                  <Column className="flex-1 text-right px-2">
                    <Text className="my-0">Размер: {item.size}</Text>
                  </Column>
                  <Column className="flex-1 text-right px-2">
                    <Text className="my-0">
                      {item.name} x {item.qty}
                    </Text>
                  </Column>
                  <Column className="flex-1 text-right px-2">
                    <Text className="my-0">
                      {formatPrice(Number(item.price), {
                        currency: "BGN",
                        IntlFormat: "bg-BG",
                      })}
                    </Text>
                  </Column>
                </Row>
              ))}
              {[
                { name: "Продукти", price: Number(order.itemsPrice) },
                { name: "Доставка", price: Number(order.shippingPrice) },
                { name: "Общо", price: Number(order.totalPrice) },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}:</Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">
                      {formatPrice(Number(price), {
                        currency: "BGN",
                        IntlFormat: "bg-BG",
                      })}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

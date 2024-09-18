import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import ProductList from "@/components/shared/product/product-list";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

const sortOrders = [
  {
    name: "Нови",
    value: "newest",
  },
  {
    name: "Цена (-)",
    value: "lowest",
  },
  {
    name: "Цена (+)",
    value: "highest",
  },
  {
    name: "Рейтинг",
    value: "rating",
  },
];

const prices = [
  {
    name: "1 - 100",
    value: "1-100",
  },
  {
    name: "101 - 200",
    value: "101-200",
  },
  {
    name: "201 - 1000",
    value: "201-1000",
  },
];

const ratings = [4, 3, 2, 1];

export async function generateMetadata({
  searchParams: { q = "all", category = "all", price = "all", rating = "all" },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  if (
    (q !== "all" && q !== "") ||
    category !== "all" ||
    rating !== "all" ||
    price !== "all"
  ) {
    return {
      title: `Search ${q !== "all" ? q : ""}
                 ${category !== "all" ? ` : Category ${category}` : ""}
                 ${price !== "all" ? ` : Price ${price}` : ""}
                 ${
                   rating !== "all" ? ` : Rating ${rating}` : ""
                 } - ${APP_NAME}`,
    };
  } else {
    return {
      title: `Search Products - ${APP_NAME}`,
    };
  }
}

export default async function SearchPage({
  searchParams: {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };
  const categories = await getAllCategories();
  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
    limit: 9,
  });
  return (
    <div className="grid md:grid-cols-5 md:gap-5 px-10">
      <div>
        <div className="text-xl pt-3">Категория</div>
        <div>
          <ul>
            <li>
              <Link
                className={`${
                  ("all" === category || "" === category) && "text-primary"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Всички
              </Link>
            </li>
            {categories.map((c: { category: string }) => (
              <li key={c.category}>
                <Link
                  className={`${c.category === category && "text-primary"}`}
                  href={getFilterUrl({ c: c.category })}
                >
                  {c.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Цена</div>
          <ul>
            <li>
              <Link
                className={`  ${"all" === price && "text-primary"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Всички
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`  ${p.value === price && "text-primary"}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xl pt-3">Рейтинг</div>
          <ul>
            <li>
              <Link
                href={getFilterUrl({ r: "all" })}
                className={`  ${"all" === rating && "text-primary"}`}
              >
                Всички
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`${r.toString() === rating && "text-primary"}`}
                >
                  {`${r} зведзди и повече`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {/* {data.length === 0 ? 'No' : countProducts} Results */}
            {q !== "all" && q !== "" && "Query : " + q}
            {category !== "all" && category !== ""
              ? "Категория: " + category
              : "Няма избрана категория"}
            {price !== "all" && "    Price: " + price}
            {rating !== "all" && "    Rating: " + rating + " & up"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant={"link"} asChild>
                <Link href="/search">Изчисти</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Сортирай по:{" "}
            {sortOrders.map((s) => (
              <Link
                key={s.value}
                className={`mx-2   ${sort == s.value && "text-primary"} `}
                href={getFilterUrl({ s: s.value })}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products!.data.length === 0 && <div>No product found</div>}
          {products!.data.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: Number(product.price),
                rating: Number(product.rating),
              }}
            />
          ))}
        </div>
        {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )}
      </div>
    </div>
  );
}

import UserButton from "./user-button";
import CartButton from "./cart-button";

const Menu = () => {
  return (
    <>
      <div className="flex justify-end gap-3">
        <nav className="flex w-full max-w-xs">
          <CartButton />
          <UserButton />
        </nav>
      </div>
    </>
  );
};

export default Menu;

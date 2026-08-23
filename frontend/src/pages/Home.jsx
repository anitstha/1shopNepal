const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-100 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-2xl text-5xl font-bold">
            Everything You Need, All in One Shop
          </h1>

          <p className="mt-4 max-w-xl text-gray-600">
            Discover quality products at the best prices with 1ShopNepal.
          </p>

          <button className="mt-6 rounded-lg bg-black px-6 py-3 text-white">
            Shop Now
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold">Shop by Category</h2>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-6 text-center">Electronics</div>

            <div className="rounded-lg border p-6 text-center">Fashion</div>

            <div className="rounded-lg border p-6 text-center">
              Home & Living
            </div>

            <div className="rounded-lg border p-6 text-center">Accessories</div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;

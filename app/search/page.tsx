import Search from "@/components/search";

const SearchPage = () => {
  return (
    <main className="w-full flex justify-center container">
      <div className="sm:w-[500px] md:w-[600px] flex flex-col items-center pt-[40px] sm:pt-[40px] md:pt-[80px]  lg:pt-[100px] xl:pt-[180px] 2xl:pt-[240px] w-full">
        <div className="py-8">
          <h1
            className="font-black text-primary text-6xl sm:text-7xl"
            style={{ fontStyle: "italic" }}
          >
            Swiftz
          </h1>
          <p
            className="pl-1 text-sm sm:text-base"
            style={{ fontStyle: "italic" }}
          >
            Discover movies at the speed of Taylor Swift
          </p>
        </div>
        <div className="w-full">
          <Search />
        </div>
      </div>
    </main>
  );
};

export default SearchPage;

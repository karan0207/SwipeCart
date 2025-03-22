import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="container mx-auto p-4">
      {!keyword && <Header />}

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError.data?.message || "Failed to load products"}
        </Message>
      ) : (
        <div className="text-center mt-20">
          <div className="flex justify-between items-center mx-10 md:mx-20">
            <h1 className="text-4xl font-bold text-gray-800">Special Products</h1>
            <Link
              to="/shop"
              className="bg-pink-600 text-white font-semibold rounded-full py-2 px-8 hover:bg-pink-700 transition"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {data.products.length > 0 ? (
              data.products.map((product) => <Product key={product._id} product={product} />)
            ) : (
              <Message variant="info">No products found</Message>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

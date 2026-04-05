import { useParams } from "react-router-dom";
import CatalogPage from "./CatalogPage";

const SellerPage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  return <CatalogPage sellerId={sellerId} />;
};

export default SellerPage;

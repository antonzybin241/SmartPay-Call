import AccountInfo from "../../components/dashboard/AccountInfo";
import MarketData from "../../components/dashboard/MarketData";
import PurchaseHistory from "../../components/dashboard/PurchaseHistory";
import RewardHistory from "../../components/dashboard/RewardHistory";

export default function Dashboard() {
  const user = {name: "user", email: "email"}
  const cryptos = [
  {
    type: "BTC",
    name: "Bitcoin",
    price: "$43,215.42",
    change: "+2.35%",
    icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
  },
  {
    type: "ETH",
    name: "Ethereum",
    price: "$2,284.11",
    change: "-1.12%",
    icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    type: "SOL",
    name: "Solana",
    price: "$98.67",
    change: "+4.89%",
    icon: "https://cryptologos.cc/logos/solana-sol-logo.png"
  },
  {
    type: "BNB",
    name: "Binance Coin",
    price: "$312.54",
    change: "+0.67%",
    icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png"
  },
  {
    type: "USDT",
    name: "Tether",
    price: "$1.00",
    change: "+0.01%",
    icon: "https://cryptologos.cc/logos/tether-usdt-logo.png"
  },
  {
    type: "XRP",
    name: "Ripple",
    price: "$0.62",
    change: "-0.45%",
    icon: "https://cryptologos.cc/logos/xrp-xrp-logo.png"
  }
  ];
  const purchaseHistory = [];
  const rewardHistory = [];

  return (
    <div className="w-full text-white px-4 py-10 md:px-12">
      <h1 className="text-[40px] md:text-[59px] font-grifter font-bold mb-2 text-center">
        Manage your Rewards and Payments
      </h1>
      <p className="text-center text-sm font-aeonik text-gray-500 mb-10">
        Pay with Crypto
      </p>

      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <AccountInfo user={user} />
          <MarketData cryptos={cryptos} />
        </div>

        <div className="mb-10">
          <PurchaseHistory data={purchaseHistory} />
        </div>

        <RewardHistory data={rewardHistory} />
      </div>
    </div>
  );
}

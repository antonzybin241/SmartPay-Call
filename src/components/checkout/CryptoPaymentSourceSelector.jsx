import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import {
  resetCheckout
} from "../../redux/checkout/checkoutActions";
import { ConnectWalletButton } from 'wallet-connect-modal';
import 'wallet-connect-modal/dist/wallets/phantom/styles.css';
import 'wallet-connect-modal/dist/wallets/metamask/styles.css';
import 'wallet-connect-modal/dist/wallets/rabby/styles.css';
import 'wallet-connect-modal/dist/wallets/tronlink/styles.css';
import 'wallet-connect-modal/dist/wallets/bitget/styles.css';
import 'wallet-connect-modal/dist/wallets/coinbase/styles.css';
import 'wallet-connect-modal/dist/wallets/solflare/styles.css';

export default function CryptoPaymentSelection() {
  const dispatch = useDispatch();
  const { loading } = useSelector(
    (state) => state.checkout
  );
  const navigate = useNavigate();

  if (loading) {
    return <LoadingScreen message="Loading your card and bank information" />;
  }

  return (
    <div className="h-full px-4 py-12 flex flex-col items-center text-white">
      <div>
        {/* <ConnectWalletButton className="mt-6 w-full py-2 border border-white text-white hover:bg-white/10 rounded-full" userId="sousa" /> */}
        <button
          onClick={() => {
            dispatch(resetCheckout());
            navigate("/checkout");
          }}
          className="mt-6 w-full py-2 border border-white text-white hover:bg-white/10 rounded-full"
        >
          Go To Previous Page
        </button>
      </div>
    </div>
  );
}

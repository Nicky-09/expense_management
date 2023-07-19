import React, { useEffect, useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AddTransactionForm from "./AddTransactionForm";
import { Button, Drawer } from "antd";

import TransactionDetail from "./TransactionDetail";

function HomeFrame() {
  const style = {
    backgroundImage: `url("home-i.png")`,
    backgroundRepeat: "repeat",
    backgroundSize: "cover",
    position: "absolute",
    height: "100%",
    width: "100%",
    zIndex: "-1",
  };
  return <div style={style}></div>;
}

export const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    console.log("call");
    const isLoggedIn = localStorage.getItem("success");
    if (!isLoggedIn) {
      navigate("/signup");
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <HomeFrame />
      <Navbar />
      <Button type="primary" onClick={showDrawer}>
        Open
      </Button>
      <TransactionDetail />

      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <AddTransactionForm />
      </Drawer>
    </div>
  );
};

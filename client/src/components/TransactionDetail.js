import axios from "axios";
import { url } from "../config";
import React, { useEffect, useState } from "react";

const TransactionDetail = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(`${url}/transactions`, {
          headers: {
            Authorization: accessToken,
          },
        });
        const data = response.data;
        console.log({ data });
        setTransactions(data);
      } catch (error) {
        console.log(error);
      }
    };

    getTransactions();
  }, [transactions]);
  return (
    <div>
      {transactions.map((transaction) => (
        <div>{transaction.amount}</div>
      ))}
    </div>
  );
};

export default TransactionDetail;

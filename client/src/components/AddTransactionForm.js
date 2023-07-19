import axios from "axios";
import { Form, Select, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { url } from "../config";

const AddTransactionForm = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      const newTransaction = {
        category: values.category,
        amount: values.amount,
        description: values.description,
        date: moment(values.date).format("YYYY-MM-DD"),
      };

      const accessToken = localStorage.getItem("access_token");

      await axios.post(`${url}/transactions`, newTransaction, {
        headers: {
          Authorization: accessToken,
        },
      });
      console.log("s");
      // Refresh the transactions list or show success message
      form.resetFields();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  //   const getTransactions = ()=

  return (
    <div className="flex ">
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item label="Category" name="category" initialValue="Expense">
          <Select>
            <Select.Option value="Expense">Expense</Select.Option>
            <Select.Option value="Income">Income</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Date" name="date">
          <Input type="date" />
        </Form.Item>
        <Form.Item>
          <Button
            className="bg-blue"
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            // onClick={getTransactions}
          >
            Add Transaction
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddTransactionForm;

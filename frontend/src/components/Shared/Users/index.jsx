import { EyeInvisibleFilled, SearchOutlined,EyeOutlined } from "@ant-design/icons";
import { Button, Card, Input,Table, Form } from "antd";
import { toast } from "react-toastify";
import { useState } from "react";
import http from "../../../utils/http";
import fetcher from "../../../utils/fetcher"
import useSWR, { mutate } from "swr";
import { formatDate } from "../../../utils/date";
// import { Form } from "react-router-dom";

const { Item } = Form;

const Users = () => {
    const [loading, setLoading] = useState(false);


    const columns = [
         {
            title: "Role",
            dataIndex: "role",
            key: "role",
            className: "capitalize"
        },
        {
            title: "Full name",
            dataIndex: "fullname",
            key: "fullname",
            className: "capitalize"
        },
        {
            title: "Mobile",
            dataIndex: "mobile",
            key: "mobile",
            className: "capitalize"
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            className: "capitalize"
        },
        {
            title: "Date",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date)
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            className: "capitalize",
            render: (status,obj) => (
                status ? (
                    <Button
                        shape="circle"
                        icon={<EyeOutlined />}
                        className="!bg-green-500 !text-white"
                        onClick={()=> onStatus(obj)}
                        loading={loading}
                    />) :
                     <Button
                        shape="circle"
                        icon={<EyeInvisibleFilled />}
                        className="!bg-rose-500 !text-white"
                        onClick={()=> onStatus(obj)}
                        loading={loading}
                    />
                )

        },

    ];

    const { data: users, error, isLoading } = useSWR(
        "/api/user/get",
        fetcher
    );

    // console.log(transactions, error, isLoading);

    const onStatus = async (obj) => {
        try {
            setLoading(true);
            await http.put(`/api/user/status/${obj._id}`,{status :!obj.status});
            toast.success("Status updated successfully !");
            mutate("/api/user/get");
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div>
            <div className="grid ">
                <Card
                    title="Transaction List"
                    style={{ overflowX: "auto" }}
                    extra={
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row gap-3">
                            <Input
                                placeholder="Search By All"
                                prefix={<SearchOutlined />}
                            />
                        </div>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={users}
                        scroll={{ x: "max-content" }}
                        loading={isLoading}
                    />
                </Card>
            </div>
        </div>
    )
}
export default Users;
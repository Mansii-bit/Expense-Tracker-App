import { Button, Card, Divider } from 'antd';
import { BarChartOutlined, DollarCircleOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import DailyTransactionChart from '../DailyTransactions.jsx';
import { useState } from 'react';
import http from "../../../utils/http.js"
import Loader from "../Loader.jsx"
import { useEffect } from 'react';


const Dashboard = () => {

    const [report, setReport] = useState(null);
    useEffect(() => {
        http.get("/api/dashboard/report")
            .then((res) => setReport(res.data))
            .catch(console.error);
    }, []);

    if (!report) return <Loader/>;
    const {summary, chart} = report;
    return (
        <div>
            <div className="grid md:grid-cols-4 gap-6">
                <Card className='shadow'>
                    <div className='flex justify-around items-center'>
                        <div className='flex items-center flex-col gap-y-2'>
                            <Button
                                type='primary'
                                icon={<BarChartOutlined />}
                                size='large'
                                shape='circle'
                                className='!bg-blue-600'
                            />
                            <h1 className='text-xl font-semibold text-blue-600'>
                                Transactions
                            </h1>
                        </div>
                        <Divider type='vertical' className='h-24' />
                        <div>
                            <h1 className='text-3xl font-bold text-blue-400'>
                                {summary.totalTransaction} T
                            </h1>
                            <p className='text-lg mt-1 text-zinc-500'>
                                {summary.totalTransactionEstimate} Estimate
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className='shadow'>
                    <div className='flex justify-around items-center'>
                        <div className='flex items-center flex-col gap-y-2'>
                            <Button
                                type='primary'
                                icon={<PlusCircleOutlined />}
                                size='large'
                                shape='circle'
                                className='!bg-green-600'
                            />
                            <h1 className='text-xl font-semibold text-green-600'>
                                Total Credits
                            </h1>
                        </div>
                        <Divider orientation='vertical' className='h-24' />
                        <div>
                            <h1 className='text-3xl font-bold text-green-400'>
                                ₹ {summary.totalCredit}
                            </h1>
                            <p className='text-lg mt-1 text-zinc-500'>
                                 ₹{summary.totalCreditEstimate} Estimate
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className='shadow'>
                    <div className='flex justify-around items-center'>
                        <div className='flex items-center flex-col gap-y-2'>
                            <Button
                                type='primary'
                                icon={<MinusCircleOutlined />}
                                size='large'
                                shape='circle'
                                className='!bg-red-600'
                            />
                            <h1 className='text-xl font-semibold text-red-600'>
                                Total Debits
                            </h1>
                        </div>
                        <Divider orientation='vertical' className='h-24' />
                        <div>
                            <h1 className='text-3xl font-bold text-red-400'>
                                 ₹{summary.totalDebit} 
                            </h1>
                            <p className='text-lg mt-1 text-zinc-500'>
                                 ₹{summary.totalDebitEstimate} Estimate
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className='shadow'>
                    <div className='flex justify-around items-center'>
                        <div className='flex items-center flex-col gap-y-2'>
                            <Button
                                type='primary'
                                icon={<DollarCircleOutlined />}
                                size='large'
                                shape='circle'
                                className='!bg-purple-700'
                            />
                            <h1 className='text-xl font-semibold text-purple-700'>
                                Balance
                            </h1>
                        </div>
                        <Divider orientation='vertical' className='h-24' />
                        <div>
                            <h1 className='text-3xl font-bold text-purple-500'>
                                ₹ {summary.balance} 
                            </h1>
                            <p className='text-lg mt-1 text-zinc-500'>
                                ₹ {summary.balanceEstimate} Estimate
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
            <div className='hidden md:block mt-5 grid md:grid-cols-1'>
                <DailyTransactionChart transactions={chart} />
            </div>
        </div>

    )
}

export default Dashboard;